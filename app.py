import os
import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Bhavani Traders API & Web Server",
    description="Backend service and web server for Bhavani Traders hardware supplier",
    version="1.0.0"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount src assets directory
app.mount("/src", StaticFiles(directory=os.path.join(BASE_DIR, "src")), name="src")

@app.get("/")
async def get_index():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "business": "Bhavani Traders",
        "category": "Hardware Supplier",
        "specialty": "Heavy-duty clamps",
        "motto": "Built for lasting reliability. Designed to resist rust.",
        "phone": "+919445117929"
    }

if __name__ == "__main__":
    print("Starting Bhavani Traders server on http://127.0.0.1:8000 ...")
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
