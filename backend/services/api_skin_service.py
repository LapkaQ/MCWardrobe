import httpx
import base64
import json
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
MOJANG_API_URL = "https://api.mojang.com/users/profiles/minecraft/"
SESSION_SERVER_URL = "https://sessionserver.mojang.com/session/minecraft/profile/"

async def get_skin_url(username: str):
    async with httpx.AsyncClient() as client:
        profile_res = await client.get(f"{MOJANG_API_URL}{username}")
        if profile_res.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        
        profile = profile_res.json()
        uuid = profile["id"]

        skin_res = await client.get(f"{SESSION_SERVER_URL}{uuid}")
        if skin_res.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch skin data")

        skin_data = skin_res.json()
        textures_base64 = skin_data["properties"][0]["value"]
        textures_json = json.loads(base64.b64decode(textures_base64))
        skin_url = textures_json["textures"]["SKIN"]["url"]
        model = "classic"
        if textures_json.get("textures", {}).get("SKIN", {}).get("metadata", {}).get("model"):
            model = textures_json["textures"]["SKIN"]["metadata"]["model"]

        profile_name = textures_json["profileName"]

        skin_body_front = f"https://api.mineatar.io/body/front/{uuid}?scale=32" 
        skin_body_back = f"https://api.mineatar.io/body/back/{uuid}?scale=16"
        return {"profile_name": profile_name, "uuid": uuid, "skin_url": skin_url, "skin_body": {"front": skin_body_front, "back": skin_body_back}, "model": model}