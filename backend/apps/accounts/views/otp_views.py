import logging

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiExample
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from apps.accounts.constants import OTPChoices
from apps.accounts.models import OTP
from apps.accounts.serializers import OTPSerializer
from apps.generic.api.api_exceptions import OTPCodeInvalidExpiredException
from apps.generic.communications import Communication
from apps.generic.docstrings import override_docstring

logger = logging.getLogger(__name__)
UserModel = get_user_model()


@extend_schema(
    request=OTPSerializer,
    tags=['OTP'],
    summary='Verify OTP code',
    examples=[
        OpenApiExample(
            name='Verify a OTP code is valid and finish with 2FA',
            summary='Simple verification',
            value={'otp_code': '1234'},
            request_only=True,
        ),
    ],
    responses={
        204: None,
        400: None
    },
)
@override_docstring(errors=['OTPCodeInvalidExpiredException'])
class VerifyOtpAPIView(APIView):
    """
    Verify and end with the 2FA process

    Possible errors:

    {errors}
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_instance = get_object_or_404(request.user.otps.filter(otp_type=OTPChoices.LOGIN))
        if not serializer.validate_otp_user(otp_instance):
            raise OTPCodeInvalidExpiredException()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OTPThrottle(UserRateThrottle):
    """ Allows 1 request every minute """
    rate = '1/minute'


@extend_schema(
    request=None,
    tags=['OTP'],
    summary='Re-send OTP code',
    responses={
        204: None,
        400: None
    },
)
class ReSendOTPAPIView(APIView):
    """ Re-send OTP code to the user email requester. Only one request every minute is allowed """
    permission_classes = [IsAuthenticated]
    throttle_classes = [OTPThrottle]  # User can ony request every 1 minute

    def post(self, request):
        user = request.user
        otp_instance, _ = OTP.objects.get_or_create(user=user, otp_type=OTPChoices.LOGIN)
        otp_instance.generate_otp()
        otp_instance.save()
        Communication().send_otp_email(user, otp_instance.otp_code)
        return Response(status=status.HTTP_204_NO_CONTENT)
