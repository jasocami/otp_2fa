from django.test import TestCase


class BaseTestCase(TestCase):

    fixtures = [
        # os.path.join(BASE_DIR, 'fixtures', 'file.json'),
    ]

    # def load_single_fixture(self, fixture_dir: str):
    #     """ Load a single fixture """

    #     for db_name in self._databases_names(include_mirrors=False):
    #         try:
    #             call_command('loaddata', fixture_dir, **{'verbosity': 0, 'database': db_name})
    #         except Exception:
    #             self._rollback_atomics(self.cls_atomics)
    #             self._remove_databases_failures()
    #             raise
