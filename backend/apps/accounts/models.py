import base64
import hashlib
from datetime import timedelta

import pyotp
from constance import config as constance_config
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.accounts.constants import OTPChoices
from apps.accounts.managers import CustomUserManager
from apps.accounts.utils import get_otp_expire_datetime


class User(AbstractBaseUser, PermissionsMixin):
    """ Model for a user account """

    ANONYMIZE_EMAIL_DOMAIN = '@anonymize.com'

    email = models.EmailField(_('email address'), max_length=255, unique=True)
    first_name = models.CharField(_('first name'), max_length=100)
    last_name = models.CharField(_('last name'), max_length=100)
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    # password_expiration_date = models.DateField(null=True, blank=True)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

    def get_full_name(self):
        """ Return the first_name plus the last_name, with a space in between. """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    @property
    def has_otp_verified(self) -> bool:
        if not constance_config.IS_TWO_FACTOR_AUTH_ACTIVE:
            return True
        try:
            otp = self.otps.get(otp_type=OTPChoices.LOGIN)
            return otp.is_verified
        except OTP.DoesNotExist:
            return False

    # def set_new_password_expire_date(self):
    #     days = constance_config.DAYS_TO_PASSWORD_EXPIRE
    #     self.password_expiration_date = date.today() + timedelta(days=days)

    # def save(self, *args, **kwargs):
    #     if not self.id and not self.password_expiration_date:
    #         self.set_new_password_expire_date()
    #     fields_stats = []
    #     if self.id:
    #         orig = User.objects.get(pk=self.pk)
    #         field_names = [field.name for field in User._meta.fields]
    #         for field_name in field_names:
    #             old_value = getattr(orig, field_name)
    #             new_value = getattr(self, field_name)
    #             if old_value != new_value:
    #                 reg = f'{field_name}'
    #                 if field_name != 'email':  # Keep the anonymize mode for the user
    #                     reg = f'{reg} {old_value} to {new_value}'
    #                 fields_stats.append(reg)
    #     else:
    #         fields_stats = [f'{self.role}']
    #     self.fields_stats = ','.join(fields_stats)
    #     super().save(*args, **kwargs)

    def anonymize(self):
        import uuid
        uid = str(uuid.uuid1())
        self.first_name = uid
        self.last_name = uid
        self.email = '%s%s' % (uid.replace('-', ''), self.ANONYMIZE_EMAIL_DOMAIN)
        self.is_active = False


class OTP(models.Model):
    user = models.ForeignKey(User, related_name='otps', on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6, help_text='OTP generated code')
    otp_type = models.CharField(max_length=6, choices=OTPChoices.choices, default=OTPChoices.LOGIN)
    is_verified = models.BooleanField(default=False, help_text='The user has verified this code')
    creation_timestamp = models.DateTimeField(auto_now_add=True)
    expiration_timestamp = models.DateTimeField(default=get_otp_expire_datetime)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'otp_type'], name='unique_together_user_otp_type'
            )
        ]

    def __str__(self):
        return f'User: {self.user} type: {self.otp_type}'

    def is_expired(self) -> bool:
        return timezone.now() > self.expiration_timestamp

    def _generate_secret(self):
        email_hash = hashlib.sha256(self.user.email.encode()).digest()
        secret = base64.b32encode(email_hash).decode('utf-8').rstrip('=')
        return secret

    def generate_otp(self):
        """ Generate a new OTP code and overrides the previous code """
        totp = pyotp.TOTP(self._generate_secret())
        self.otp_code = totp.now()
        self.is_verified = False
        self.creation_timestamp = timezone.now()
        self.expiration_timestamp = timezone.now() + timedelta(minutes=constance_config.OTP_EXPIRE_MINUTES)
        self.save()

    def validate_otp_code(self, otp_input) -> bool:
        """ Validate an OTP input code from user """
        if self.otp_code != otp_input:
            return False

        totp = pyotp.TOTP(self._generate_secret())
        # Validate OTP with 8 window of 30 sec each, equal to 4 min
        if totp.verify(otp_input, valid_window=8):
            self.is_verified = True
            self.save()
            return True
        return False
