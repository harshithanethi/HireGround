from __future__ import annotations

from fastapi import APIRouter, Depends, Header, HTTPException, status

from app.schemas import AuthResponse, GoogleAuthRequest, UserProfile
from app.services.auth import decode_access_token, issue_access_token, verify_google_token


router = APIRouter()


def _extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization format")
    return parts[1]


@router.post("/v1/auth/google", response_model=AuthResponse)
def google_auth(payload: GoogleAuthRequest):
    claims = verify_google_token(payload.id_token)
    token = issue_access_token(claims)
    user = UserProfile(
        sub=str(claims.get("sub")),
        email=claims.get("email"),
        name=claims.get("name"),
        picture=claims.get("picture"),
    )
    return AuthResponse(access_token=token, user=user)


@router.get("/v1/auth/me", response_model=UserProfile)
def auth_me(authorization: str | None = Header(default=None)):
    token = _extract_bearer_token(authorization)
    claims = decode_access_token(token)
    return UserProfile(
        sub=str(claims.get("sub")),
        email=claims.get("email"),
        name=claims.get("name"),
        picture=claims.get("picture"),
    )
