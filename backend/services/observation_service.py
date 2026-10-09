from typing import Any
from uuid import uuid4

from database.mongodb import collection, memory_store, serialize


def create_observations(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not items:
        return []
    records = collection("observations")
    if records is not None:
        result = records.insert_many(items)
        return [serialize(records.find_one({"_id": item_id})) for item_id in result.inserted_ids]
    store = memory_store("observations")
    enriched = [{**item, "id": str(uuid4())} for item in items]
    store.extend(enriched)
    return enriched


def list_observations(object_name=None, person_name=None) -> list[dict[str, Any]]:
    records = collection("observations")
    if records is not None:
        query = {}
        if object_name:
            query["object"] = {"$regex": object_name, "$options": "i"}
        if person_name:
            query["person"] = {"$regex": f"^{person_name}$", "$options": "i"}
        return [serialize(item) for item in records.find(query).sort("timestamp", -1)]
    items = memory_store("observations")
    return sorted(
        [item for item in items if (not object_name or object_name.lower() in item["object"].lower())
         and (not person_name or (item.get("person") or "").lower() == person_name.lower())],
        key=lambda item: item["timestamp"], reverse=True)
