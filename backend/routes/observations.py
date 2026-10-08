from fastapi import APIRouter, Query

from services.observation_service import list_observations

router = APIRouter(prefix="/api/observations", tags=["observations"])


@router.get("")
def get_observations(object_name: str | None = Query(default=None, alias="object"),
                     person: str | None = None):
    return list_observations(object_name, person)


@router.get("/latest")
def get_latest_observations(limit: int = Query(default=10, ge=1, le=100)):
    return list_observations()[:limit]


@router.get("/object/{object_name}")
def get_object_observations(object_name: str):
    return list_observations(object_name=object_name)


@router.get("/person/{person_name}")
def get_person_observations(person_name: str):
    return list_observations(person_name=person_name)
