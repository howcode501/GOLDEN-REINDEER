from app.main import app

# This entrypoint allows Vercel to detect FastAPI directly at backend root
# and also supports local execution via `python main.py`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
