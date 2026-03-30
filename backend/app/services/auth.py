from __future__ import annotations

import os
import time
from typing import Any, Dict

import jwt
from fastapi import HTTPException, status
from google.auth.transport import requests as grequests
from google.oauth2 import id_token as gid_token


def _jwt_secret() -> str:
    return os.getenv("HIREGROUND_JWT_SECRET", "dev-change-me")


def _jwt_exp_seconds() -> int:
    try:
        return int(os.getenv("HIREGROUND_JWT_EXPIRES_SECONDS", "86400"))
    except ValueError:
        return 86400


def verify_google_token(google_id_token: str) -> Dict[str, Any]:
    """
    Verifies Google ID token from GIS frontend.
    If GOOGLE_CLIENT_ID is set, audience is strictly checked.
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    try:
        idinfo = gid_token.verify_oauth2_token(
            google_id_token,
            grequests.Request(),
            audience=client_id if client_id else None,
        )
        return dict(idinfo)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {exc}",
        ) from exc


def issue_access_token(user_claims: Dict[str, Any]) -> str:
    now = int(time.time())
    payload = {
        "sub": user_claims.get("sub"),
        "email": user_claims.get("email"),
        "name": user_claims.get("name"),
        "picture": user_claims.get("picture"),
        "iat": now,
        "exp": now + _jwt_exp_seconds(),
        "iss": "hireground-api",
    }
    return jwt.encode(payload, _jwt_secret(), algorithm="HS256")


def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=["HS256"])
        return dict(payload)
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid access token: {exc}",
        ) from exc
