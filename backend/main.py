from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.controllers import auth_controller, request_controller, admin_controller

app = FastAPI(title="Sanguis AI - MVC Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Mounting (Controllers)
app.include_router(auth_controller.router)
app.include_router(request_controller.router)
app.include_router(admin_controller.router)
