from django.apps import AppConfig


class BackendRouterConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "backend_router"

    def ready(self):
        import backend_router.signals
        from .rag_utils import init_rag
        # Initialize RAG in a separate thread or at startup if it's fast
        try:
            init_rag()
        except Exception as e:
            print(f"Failed to initialize RAG: {e}")
