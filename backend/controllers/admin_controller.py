from fastapi import APIRouter
from backend.core.database import users_collection, requests_collection

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/stats")
async def get_admin_stats():
    hospitals = await users_collection.count_documents({"role": "hospital"})
    donors = await users_collection.count_documents({"role": "donor"})
    active_requests = await requests_collection.count_documents({"status": "pending_donor"})
    
    return {
        "hospitals": hospitals,
        "donors": donors,
        "live_requests": active_requests
    }
