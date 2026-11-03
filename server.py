#!/usr/bin/env python3
"""
DARAH SKANTRI — Zero-Dependency Multiplayer 3D Server (Python 3.12 asyncio + WebSocket)
Fitur Lengkap:
- 1 Lobby Terpadu Otomatis untuk Mabar 4 Orang + Panel Invite Teman (Pemain Online & Squad Companion)
- Tombol Keluar dari Game ([Q] / Tombol Keluar ke Lobby kapan saja)
- 5 Karakter Sesuai Nama & Wujud 3D (Rizky OSIS, Siti Indigo, Bima Basket, Citra PMR, Pak Dedi Satpam)
- Gedung Sekolah 4 Lantai: Setiap pintu 6 gembok terbuka -> Otomatis lanjut naik ke Lantai Berikutnya (Lantai 1 -> 2 -> 3 -> 4 -> Lolos!)
- Wujud Hantu Kuntilanak Lari Cepat + Suara Ketawa Kuntilanak ("Hihihihihi!")
"""

import asyncio
import base64
import hashlib
import json
import math
import mimetypes
import os
import random
import struct
import time
import shutil
from collections import deque
from pathlib import Path
from urllib.parse import unquote

mimetypes.add_type("model/gltf-binary", ".glb")

PUBLIC_DIR = Path(__file__).parent / "public"
STAGE_PHOTO_SOURCE = Path("/home/adit/Downloads/WhatsApp Image 2026-11-03 at 07.00.05.jpeg")
STAGE_PHOTO_DEST = PUBLIC_DIR / "lobby-bg.jpeg"

if STAGE_PHOTO_SOURCE.is_file():
    try:
        shutil.copyfile(STAGE_PHOTO_SOURCE, STAGE_PHOTO_DEST)
    except Exception:
        pass

PORT = int(os.environ.get("PORT", 3000))

CELL_SIZE = 4
MAP_GRID = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

FLOOR_NAMES = {
    1: "LANTAI 1 — RUANG AMAN, KELAS X & KAMAR MANDI LT.1",
    2: "LANTAI 2 — KORIDOR KELAS XI, RUANG GURU & KAMAR MANDI LT.2",
    3: "LANTAI 3 — KORIDOR KELAS XII, LAB & KAMAR MANDI LT.3",
    4: "LANTAI 4 — AULA ATAP SEKOLAH & GERBANG KELUAR",
}

LOCKER_COORDS = [
    {"id": "locker_1", "row": 11, "col": 2, "yaw": 0.0, "kind": "locker", "label": "Loker Koridor Selatan"},
    {"id": "locker_2", "row": 11, "col": 12, "yaw": 0.0, "kind": "locker", "label": "Loker Koridor Selatan"},
    {"id": "stall_bath_west", "row": 9, "col": 3, "yaw": math.pi / 2, "kind": "stall", "label": "Bilik Kamar Mandi Barat"},
    {"id": "stall_bath_east", "row": 9, "col": 11, "yaw": -math.pi / 2, "kind": "stall", "label": "Bilik Kamar Mandi Timur"},
    {"id": "locker_3", "row": 7, "col": 1, "yaw": math.pi / 2, "kind": "locker", "label": "Loker Tangga Barat"},
    {"id": "locker_4", "row": 7, "col": 7, "yaw": 0.0, "kind": "locker", "label": "Loker Koridor Tengah"},
    {"id": "locker_5", "row": 7, "col": 13, "yaw": -math.pi / 2, "kind": "locker", "label": "Loker Tangga Timur"},
    {"id": "locker_6", "row": 5, "col": 4, "yaw": 0.0, "kind": "locker", "label": "Loker Depan Kelas"},
    {"id": "locker_7", "row": 5, "col": 10, "yaw": 0.0, "kind": "locker", "label": "Loker Depan Kamar Mandi"},
    {"id": "stall_bath_north", "row": 2, "col": 11, "yaw": -math.pi / 2, "kind": "stall", "label": "Bilik Kamar Mandi Utara"},
    {"id": "locker_8", "row": 1, "col": 2, "yaw": math.pi, "kind": "locker", "label": "Loker Sayap Utara"},
]

KEY_TYPES = [
    {"lockIndex": 1, "name": "Konci #1 (Merah)", "value": 1, "color": 0xEF4444, "shape": "key"},
    {"lockIndex": 2, "name": "Konci #2 (Emas)", "value": 1, "color": 0xFBBF24, "shape": "key"},
    {"lockIndex": 3, "name": "Konci #3 (Biru)", "value": 1, "color": 0x38BDF8, "shape": "key"},
    {"lockIndex": 4, "name": "Konci #4 (Hijau)", "value": 1, "color": 0x22C55E, "shape": "key"},
    {"lockIndex": 5, "name": "Konci #5 (Ungu)", "value": 1, "color": 0xA855F7, "shape": "key"},
    {"lockIndex": 6, "name": "Konci #6 (Perak)", "value": 1, "color": 0xE5E7EB, "shape": "key"},
]

VALID_SKINS = ["adit", "maulana", "fery", "wahyu", "alex", "rafi", "rizky", "siti", "bima", "citra", "dedi"]
SKIN_COLORS = {
    "adit": 0xE2E8F0,
    "maulana": 0xA855F7,
    "fery": 0xEF4444,
    "wahyu": 0x10B981,
    "alex": 0x1D4ED8,
    "rafi": 0x38BDF8,
    "rizky": 0xE2E8F0,
    "siti": 0xA855F7,
    "bima": 0xEF4444,
    "citra": 0x10B981,
    "dedi": 0x1D4ED8,
}

FRIEND_PRESETS = {
    "adit": {"name": "Adit•OSIS", "skinId": "adit"},
    "maulana": {"name": "Maulana•Indigo", "skinId": "maulana"},
    "fery": {"name": "Fery•Basket", "skinId": "fery"},
    "wahyu": {"name": "Wahyu•PMR", "skinId": "wahyu"},
    "alex": {"name": "Alex•Patroli", "skinId": "alex"},
    "rafi": {"name": "Rafi•TKJ", "skinId": "rafi"},
    "siti": {"name": "Maulana•Indigo", "skinId": "maulana"},
    "bima": {"name": "Fery•Basket", "skinId": "fery"},
    "citra": {"name": "Wahyu•PMR", "skinId": "wahyu"},
    "dedi": {"name": "Alex•Patroli", "skinId": "alex"},
    "rizky": {"name": "Adit•OSIS", "skinId": "adit"},
}

TOTAL_KEYS_REQUIRED = 6
MAX_FLOORS = 4
MAIN_LOBBY_CODE = "SEKOLAH1"
ACCOUNTS_FILE = Path(__file__).parent / "accounts_db.json"

rooms = {}
clients = {}


def load_accounts_db():
    if ACCOUNTS_FILE.is_file():
        try:
            return json.loads(ACCOUNTS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"accounts": {}}


def save_accounts_db(db_data):
    try:
        ACCOUNTS_FILE.write_text(json.dumps(db_data, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass


accounts_db = load_accounts_db()


def grid_to_world(row, col):
    offset = (len(MAP_GRID) * CELL_SIZE) / 2.0
    return {
        "x": col * CELL_SIZE - offset + CELL_SIZE / 2.0,
        "z": row * CELL_SIZE - offset + CELL_SIZE / 2.0,
    }


def world_to_grid(x, z):
    offset = (len(MAP_GRID) * CELL_SIZE) / 2.0
    col = int(math.floor((x + offset) / CELL_SIZE))
    row = int(math.floor((z + offset) / CELL_SIZE))
    return row, col


def is_walkable(x, z, allow_safe=False):
    row, col = world_to_grid(x, z)
    if row < 0 or row >= len(MAP_GRID) or col < 0 or col >= len(MAP_GRID[0]):
        return False
    cell = MAP_GRID[row][col]
    if cell == 1:
        return False
    if cell == 2 and not allow_safe:
        return False
    return True


def has_line_of_sight(x1, z1, x2, z2):
    dist = math.hypot(x2 - x1, z2 - z1)
    if dist < 0.2:
        return True
    steps = max(2, int(dist / 0.55))
    for i in range(1, steps):
        t = i / steps
        px = x1 + (x2 - x1) * t
        pz = z1 + (z2 - z1) * t
        if not is_walkable(px, pz, False):
            return False
    return True


def find_next_path_world(mx, mz, tx, tz):
    sr, sc = world_to_grid(mx, mz)
    tr, tc = world_to_grid(tx, tz)
    rows, cols = len(MAP_GRID), len(MAP_GRID[0])

    if (sr, sc) == (tr, tc):
        return {"x": tx, "z": tz}

    queue = deque([(sr, sc)])
    parent = {(sr, sc): None}
    found = False

    while queue:
        r, c = queue.popleft()
        if (r, c) == (tr, tc):
            found = True
            break
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in parent:
                if MAP_GRID[nr][nc] == 0 or (nr == tr and nc == tc and MAP_GRID[nr][nc] != 1):
                    parent[(nr, nc)] = (r, c)
                    queue.append((nr, nc))

    if not found:
        return {"x": tx, "z": tz}

    path = []
    cur = (tr, tc)
    while cur is not None and cur != (sr, sc):
        path.append(cur)
        cur = parent.get(cur)
    path.reverse()

    if not path:
        return {"x": tx, "z": tz}

    next_cell = path[0]
    wp = grid_to_world(next_cell[0], next_cell[1])
    if len(path) > 1 and math.hypot(wp["x"] - mx, wp["z"] - mz) < 0.85:
        next_cell = path[1]
        wp = grid_to_world(next_cell[0], next_cell[1])
    return wp


def move_monster_toward(m, target_x, target_z, speed, dt):
    dx = target_x - m["x"]
    dz = target_z - m["z"]
    dist = math.hypot(dx, dz)
    if dist <= 0.04:
        return False

    m["yaw"] = math.atan2(dx, dz)
    step = min(dist, speed * dt)
    sx = (dx / dist) * step
    sz = (dz / dist) * step

    moved = False
    if is_walkable(m["x"] + sx, m["z"], False):
        m["x"] += sx
        moved = True
    if is_walkable(m["x"], m["z"] + sz, False):
        m["z"] += sz
        moved = True
    return moved


def build_lockers():
    lockers = []
    for lk in LOCKER_COORDS:
        wp = grid_to_world(lk["row"], lk["col"])
        kind = lk.get("kind", "locker")
        z_off = -0.85 if kind == "stall" else -1.15
        lockers.append({
            "id": lk["id"],
            "x": wp["x"],
            "z": wp["z"] + z_off,
            "yaw": lk["yaw"],
            "kind": kind,
            "label": lk.get("label", "Loker Sekolah"),
            "occupantId": None,
        })
    return lockers


def generate_ritual_candles():
    candidate_cells = [(9, 3), (9, 11), (5, 2), (5, 8), (3, 5), (3, 10), (7, 5), (7, 9)]
    random.shuffle(candidate_cells)
    candles = []
    for i in range(3):
        r, c = candidate_cells[i]
        wp = grid_to_world(r, c)
        candles.append({
            "id": f"candle_{i}",
            "name": f"Segel Lilin Darah #{i + 1}",
            "x": wp["x"],
            "z": wp["z"],
            "lit": False,
        })
    return candles


def get_valid_key_spawns():
    # Prioritaskan Konci muncul di Kamar Mandi, Meja Kelas, dan Meja Koridor seperti Peta Eta Sekolah Roblox
    priority_school_spots = [
        (8, 3),   # Wastafel Kamar Mandi Barat
        (8, 11),  # Wastafel Kamar Mandi Timur
        (2, 3),   # Meja Kelas Barat
        (3, 7),   # Meja Ruang Guru / Kelas Tengah
        (2, 11),  # Kamar Mandi / Kelas Utara Timur
        (5, 5),   # Meja Koridor Tengah Barat
        (5, 9),   # Meja Koridor Tengah Timur
        (7, 5),   # Persimpangan Kelas Barat
        (7, 9),   # Persimpangan Kelas Timur
        (1, 7),   # Koridor Utara Sekolah
        (9, 5),   # Lorong Kamar Mandi Barat
        (9, 9),   # Lorong Kamar Mandi Timur
    ]
    valid = [(r, c) for (r, c) in priority_school_spots if MAP_GRID[r][c] == 0]
    if len(valid) < 6:
        for r in range(1, len(MAP_GRID) - 3):
            for c in range(1, len(MAP_GRID[0]) - 1):
                if MAP_GRID[r][c] == 0 and (r, c) not in valid:
                    valid.append((r, c))
    return valid


def generate_keys(floor_num=1):
    # Sebarkan 6 Konci di Lantai 1, Lantai 2 (Atas), dan Lantai 3 (Atas) agar pemain bisa naik tangga mencari kunci!
    # Konci #1 & #2 di Lantai 1, Konci #3 & #4 di Lantai 2, Konci #5 & #6 di Lantai 3
    floor_assignment = {
        1: 1,
        2: 1,
        3: 2,
        4: 2,
        5: 3,
        6: 3,
    }
    cells_by_floor = {
        1: list(get_valid_key_spawns()),
        2: list(get_valid_key_spawns()),
        3: list(get_valid_key_spawns()),
    }
    for fl in cells_by_floor:
        random.shuffle(cells_by_floor[fl])

    items = []
    ts = int(time.time() * 1000)
    for kt in KEY_TYPES:
        lock_idx = kt["lockIndex"]
        k_floor = floor_assignment.get(lock_idx, 1)
        r, c = cells_by_floor[k_floor].pop(0)
        wp = grid_to_world(r, c)
        items.append({
            "id": f"key_f{k_floor}_{lock_idx}_{ts}",
            "lockIndex": lock_idx,
            "keyFloor": k_floor,
            "name": f"{kt['name']} [Lantai {k_floor}]",
            "value": 1,
            "color": kt["color"],
            "shape": "key",
            "x": wp["x"],
            "y": 0.88,
            "z": wp["z"],
            "carrierId": None,
            "deposited": False,
        })
    return items


def create_room(code):
    ms = grid_to_world(3, 7)
    room = {
        "code": code,
        "state": "lobby",
        "endReason": "",
        "currentFloor": 1,
        "maxFloors": MAX_FLOORS,
        "floorName": FLOOR_NAMES[1],
        "quota": 0,
        "targetQuota": TOTAL_KEYS_REQUIRED,
        "players": {},
        "scraps": generate_keys(1),
        "lockers": build_lockers(),
        "ritualCandles": generate_ritual_candles(),
        "reviveReady": False,
        "monster": {
            "x": ms["x"],
            "z": ms["z"],
            "yaw": 0.0,
            "state": "patrol",
            "targetPlayerId": None,
            "waypoint": None,
            "lastLaughTime": 0.0,
            "detectTimer": 0.0,
            "graceUntil": 0.0,
        },
    }
    rooms[code] = room
    return room


def setup_floor(room, floor_num):
    ms = grid_to_world(3, 7)
    room["currentFloor"] = floor_num
    room["floorName"] = FLOOR_NAMES.get(floor_num, f"LANTAI {floor_num}")
    room["quota"] = 0
    room["scraps"] = generate_keys(floor_num)
    room["lockers"] = build_lockers()
    room["ritualCandles"] = generate_ritual_candles()
    room["reviveReady"] = False
    room["monster"] = {
        "x": ms["x"],
        "z": ms["z"],
        "yaw": 0.0,
        "state": "patrol",
        "targetPlayerId": None,
        "waypoint": None,
        "lastLaughTime": time.time(),
        "detectTimer": 0.0,
        "graceUntil": time.time() + 4.5,
    }
    spawns = [grid_to_world(12, 6), grid_to_world(12, 7), grid_to_world(12, 8)]
    for idx, p in enumerate(room["players"].values()):
        sp = spawns[idx % len(spawns)]
        p["x"] = sp["x"] + (random.random() - 0.5) * 0.4
        p["y"] = 1.6
        p["z"] = sp["z"]
        p["yaw"] = 0.0
        p["pitch"] = 0.0
        p["alive"] = True
        p["hiding"] = False
        p["lockerId"] = None
        p["flashlight"] = True
        p["inventory"] = []
        p["deathX"] = sp["x"]
        p["deathZ"] = sp["z"]
        p["botTarget"] = None


def start_or_reset_match(room):
    room["state"] = "playing"
    room["endReason"] = ""
    setup_floor(room, 1)


def get_single_unified_lobby():
    if MAIN_LOBBY_CODE not in rooms:
        create_room(MAIN_LOBBY_CODE)
    room = rooms[MAIN_LOBBY_CODE]
    real_players = [p for p in room["players"].values() if not p.get("isBot")]
    if len(real_players) < 4:
        # Jika penuh karena ada bot teman, hapus 1 bot agar pemain asli bisa masuk ke 1 lobby yang sama
        if len(room["players"]) >= 4:
            for pid, p in list(room["players"].items()):
                if p.get("isBot"):
                    room["players"].pop(pid, None)
                    break
        return MAIN_LOBBY_CODE
    return MAIN_LOBBY_CODE


def encode_ws_frame(text: str) -> bytes:
    payload = text.encode("utf-8")
    length = len(payload)
    header = bytearray([0x81])
    if length < 126:
        header.append(length)
    elif length < 65536:
        header.append(126)
        header.extend(struct.pack("!H", length))
    else:
        header.append(127)
        header.extend(struct.pack("!Q", length))
    return bytes(header) + payload


async def send_event(client_id, event, data=None):
    writer = clients.get(client_id)
    if not writer:
        return
    try:
        msg = json.dumps({"event": event, "data": data})
        writer.write(encode_ws_frame(msg))
        await writer.drain()
    except Exception:
        pass


async def broadcast_room(code, event, data=None):
    room = rooms.get(code)
    if not room:
        return
    for pid in list(room["players"].keys()):
        if not pid.startswith("bot_"):
            await send_event(pid, event, data)


async def unlock_and_check_floor(code, room, p):
    unlocked_names = []
    while p["inventory"]:
        sid = p["inventory"].pop()
        for s in room["scraps"]:
            if s["id"] == sid and not s["deposited"]:
                s["carrierId"] = None
                s["deposited"] = True
                room["quota"] += 1
                unlocked_names.append(f"Gembok #{s['lockIndex']}")
    if unlocked_names:
        await broadcast_room(
            code,
            "systemMessage",
            f"🔓 {p['name']} membuka {', '.join(unlocked_names)} di Lantai {room['currentFloor']}! ({room['quota']}/{room['targetQuota']} Gembok)",
        )
        await broadcast_room(code, "scrapUpdated", {
            "scraps": room["scraps"],
            "players": room["players"],
            "quota": room["quota"],
        })

        if room["quota"] >= room["targetQuota"]:
            if room["currentFloor"] < MAX_FLOORS:
                next_floor = room["currentFloor"] + 1
                setup_floor(room, next_floor)
                await broadcast_room(
                    code,
                    "systemMessage",
                    f"🚪 PINTU LANTAI {next_floor - 1} TERBUKA! Seluruh Tim naik ke {room['floorName']}!",
                )
                await broadcast_room(code, "floorAdvanced", room)
            else:
                room["state"] = "won"
                room["endReason"] = "BOOYAH! Seluruh 4 Lantai Gedung Sekolah berhasil ditembus & Pintu Gerbang Utama terbuka! Timmu berhasil lolos!"
                await broadcast_room(code, "roundEnded", {
                    "state": room["state"],
                    "reason": room["endReason"],
                    "quota": room["quota"],
                })


def ensure_client_in_room(client_id, current_room_ref):
    code = current_room_ref.get("code")
    if code and code in rooms and client_id in rooms[code]["players"]:
        return code, rooms[code]
    code = f"SOLO_{client_id}"
    if code not in rooms:
        create_room(code)
    room = rooms[code]
    current_room_ref["code"] = code
    if client_id not in room["players"]:
        sp = grid_to_world(12, 6)
        room["players"][client_id] = {
            "id": client_id,
            "name": "Adit•OSIS",
            "skinId": "adit",
            "outfit": {"outfitId": "default", "headgear": "default", "skinTone": "#f1c27d", "customShirt": "", "customPants": ""},
            "color": SKIN_COLORS.get("adit", 0xE2E8F0),
            "ready": True,
            "isBot": False,
            "slotIndex": 0,
            "x": sp["x"],
            "y": 1.6,
            "z": sp["z"],
            "yaw": 0.0,
            "pitch": 0.0,
            "flashlight": True,
            "alive": True,
            "hiding": False,
            "lockerId": None,
            "inventory": [],
            "deathX": sp["x"],
            "deathZ": sp["z"],
        }
    return code, room


async def handle_ws_message(client_id, current_room_ref, msg_text):
    try:
        packet = json.loads(msg_text)
    except Exception:
        return
    event = packet.get("event")
    data = packet.get("data")

    if event == "joinRoom":
        username = str((data or {}).get("username", "Adit•OSIS")).strip()[:16] or "Adit•OSIS"
        skin_id = str((data or {}).get("skinId", "adit")).strip().lower()
        outfit_data = (data or {}).get("outfit") if isinstance((data or {}).get("outfit"), dict) else {"outfitId": "default", "headgear": "default", "skinTone": "#f1c27d", "customShirt": "", "customPants": ""}
        mode = str((data or {}).get("mode", "solo")).strip().lower()
        custom_code = str((data or {}).get("roomCode", "")).strip().upper()[:12]
        if skin_id not in VALID_SKINS:
            skin_id = "adit"

        # Keluarkan dari room sebelumnya jika sedang berpindah mode (Solo <-> Mabar 4 Orang)
        old_code = current_room_ref.get("code")
        if old_code and old_code in rooms:
            old_room = rooms[old_code]
            old_room["players"].pop(client_id, None)
            if old_code.startswith("SOLO_") and not old_room["players"]:
                rooms.pop(old_code, None)
            else:
                for idx, rem_p in enumerate(old_room["players"].values()):
                    rem_p["slotIndex"] = idx
                await broadcast_room(old_code, "lobbyUpdated", {"players": old_room["players"], "state": old_room["state"]})

        if mode == "solo":
            code = f"SOLO_{client_id}"
            if code not in rooms:
                create_room(code)
            room = rooms[code]
            # Pastikan di Lobby 1 Orang (Solo) hanya ada 1 pemain tersebut
            room["players"].clear()
        else:
            code = custom_code if custom_code else get_single_unified_lobby()
            if code not in rooms:
                create_room(code)
            room = rooms[code]
            if len(room["players"]) >= 4:
                for pid, p_existing in list(room["players"].items()):
                    if p_existing.get("isBot"):
                        room["players"].pop(pid, None)
                        break

        current_room_ref["code"] = code
        p_idx = len(room["players"])
        sp = grid_to_world(12, 6 + (p_idx % 3))
        room["players"][client_id] = {
            "id": client_id,
            "name": username,
            "skinId": skin_id,
            "outfit": outfit_data,
            "color": SKIN_COLORS.get(skin_id, 0xE2E8F0),
            "ready": True,
            "isBot": False,
            "slotIndex": p_idx,
            "x": sp["x"] + (random.random() - 0.5) * 0.5,
            "y": 1.6,
            "z": sp["z"],
            "yaw": 0.0,
            "pitch": 0.0,
            "flashlight": True,
            "alive": True,
            "hiding": False,
            "lockerId": None,
            "inventory": [],
            "deathX": sp["x"],
            "deathZ": sp["z"],
        }

        await send_event(client_id, "joinedRoom", {
            "playerId": client_id,
            "roomCode": code,
            "mode": mode,
            "mapGrid": MAP_GRID,
            "cellSize": CELL_SIZE,
            "state": room,
        })
        await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"], "roomCode": code})
        if mode != "solo":
            await broadcast_room(code, "lobbyChatMessage", {
                "sender": "LOBBY MABAR 4P",
                "text": f"{username} bergabung ke Room Mabar {code} ({len(room['players'])}/4 Pemain)!",
                "isSystem": True,
            })

    elif event == "changeName":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        p = room["players"].get(client_id)
        if not p:
            return
        new_name = str(data or "").strip()[:15]
        if new_name:
            p["name"] = new_name
            await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"], "roomCode": code})

    elif event == "registerAccount":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        raw_user = str((data or {}).get("username", "")).strip()[:15]
        raw_pin = str((data or {}).get("pin", "")).strip()[:16]
        skin_id = str((data or {}).get("skinId", "rizky")).strip().lower()
        if skin_id not in VALID_SKINS:
            skin_id = "rizky"

        if len(raw_user) < 2:
            await send_event(client_id, "accountAuthResult", {
                "ok": False,
                "message": "Nama akun minimal 2 karakter!",
            })
            return

        user_key = raw_user.lower()
        existing = accounts_db["accounts"].get(user_key)
        if existing:
            await send_event(client_id, "accountAuthResult", {
                "ok": False,
                "message": f"Username '{raw_user}' sudah terdaftar! Silakan klik tombol MASUK AKUN.",
            })
            return

        acc_id = f"SK-{random.randint(1000, 9999)}"
        new_acc = {
            "accountId": acc_id,
            "username": raw_user,
            "pin": raw_pin or "1234",
            "skinId": skin_id,
            "createdAt": int(time.time()),
            "savedFriends": [
                {"id": "fr_maulana", "name": "Maulana•Indigo", "skinId": "maulana", "friendCode": "SK-1001"},
                {"id": "fr_fery", "name": "Fery•Basket", "skinId": "fery", "friendCode": "SK-1002"},
                {"id": "fr_wahyu", "name": "Wahyu•PMR", "skinId": "wahyu", "friendCode": "SK-1003"},
                {"id": "fr_alex", "name": "Alex•Patroli", "skinId": "alex", "friendCode": "SK-1004"},
                {"id": "fr_rafi", "name": "Rafi•TKJ", "skinId": "rafi", "friendCode": "SK-1005"},
            ],
        }
        accounts_db["accounts"][user_key] = new_acc
        save_accounts_db(accounts_db)

        p = room["players"].get(client_id)
        if p:
            p["name"] = raw_user
            p["skinId"] = skin_id
            p["color"] = SKIN_COLORS.get(skin_id, 0xE2E8F0)
            await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"], "roomCode": code})

        await send_event(client_id, "accountAuthResult", {
            "ok": True,
            "mode": "register",
            "message": f"Akun '{raw_user}' ({acc_id}) berhasil didaftarkan!",
            "account": {
                "accountId": new_acc["accountId"],
                "username": new_acc["username"],
                "skinId": new_acc["skinId"],
                "savedFriends": new_acc["savedFriends"],
            },
        })

    elif event == "loginAccount":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        raw_user = str((data or {}).get("username", "")).strip()[:15]
        raw_pin = str((data or {}).get("pin", "")).strip()[:16]
        user_key = raw_user.lower()
        existing = accounts_db["accounts"].get(user_key)

        if not existing:
            await send_event(client_id, "accountAuthResult", {
                "ok": False,
                "message": f"Akun '{raw_user}' belum ditemukan! Klik DAFTAR AKUN BARU terlebih dahulu.",
            })
            return

        if existing.get("pin") and raw_pin and existing.get("pin") != raw_pin:
            await send_event(client_id, "accountAuthResult", {
                "ok": False,
                "message": "PIN / Password akun salah!",
            })
            return

        p = room["players"].get(client_id)
        if p:
            p["name"] = existing["username"]
            p["skinId"] = existing.get("skinId", "rizky")
            p["color"] = SKIN_COLORS.get(p["skinId"], 0xE2E8F0)
            await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"], "roomCode": code})

        await send_event(client_id, "accountAuthResult", {
            "ok": True,
            "mode": "login",
            "message": f"Selamat datang kembali, {existing['username']} ({existing['accountId']})!",
            "account": {
                "accountId": existing["accountId"],
                "username": existing["username"],
                "skinId": existing.get("skinId", "rizky"),
                "savedFriends": existing.get("savedFriends", []),
            },
        })

    elif event == "saveNewFriend":
        raw_acc_user = str((data or {}).get("accountUsername", "")).strip().lower()
        friend_name = str((data or {}).get("name", "")).strip()[:15]
        friend_skin = str((data or {}).get("skinId", "rizky")).strip().lower()
        friend_code = str((data or {}).get("friendCode", "")).strip().upper()[:12]
        if friend_skin not in VALID_SKINS:
            friend_skin = "rizky"

        if not friend_name:
            return

        if not friend_code:
            friend_code = f"SK-{random.randint(1000, 9999)}"

        new_friend_item = {
            "id": f"fr_{int(time.time()*1000)}_{random.randint(100,999)}",
            "name": friend_name,
            "skinId": friend_skin,
            "friendCode": friend_code,
        }

        saved_list = None
        if raw_acc_user and raw_acc_user in accounts_db["accounts"]:
            acc = accounts_db["accounts"][raw_acc_user]
            acc.setdefault("savedFriends", [])
            # Hindari duplikat nama yang sama persis
            acc["savedFriends"] = [f for f in acc["savedFriends"] if f.get("name", "").lower() != friend_name.lower()]
            acc["savedFriends"].insert(0, new_friend_item)
            save_accounts_db(accounts_db)
            saved_list = acc["savedFriends"]

        await send_event(client_id, "friendSavedResult", {
            "ok": True,
            "friend": new_friend_item,
            "savedFriends": saved_list,
            "message": f"Teman baru '{friend_name}' ({friend_code}) berhasil disimpan ke daftar Mabar!",
        })

    elif event == "removeSavedFriend":
        raw_acc_user = str((data or {}).get("accountUsername", "")).strip().lower()
        friend_id = str((data or {}).get("friendId", "")).strip()
        if raw_acc_user and raw_acc_user in accounts_db["accounts"]:
            acc = accounts_db["accounts"][raw_acc_user]
            acc["savedFriends"] = [f for f in acc.get("savedFriends", []) if f.get("id") != friend_id]
            save_accounts_db(accounts_db)
            await send_event(client_id, "friendRemovedResult", {
                "ok": True,
                "friendId": friend_id,
                "savedFriends": acc["savedFriends"],
            })

    elif event == "inviteFriend":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        if len(room["players"]) >= 4:
            await send_event(client_id, "lobbyChatMessage", {
                "sender": "SISTEM INVITE",
                "text": "Squad sudah penuh (4/4 Pemain)! Siap memulai permainan.",
                "isSystem": True,
            })
            return

        if isinstance(data, dict):
            f_name = str(data.get("name", "Teman•Mabar")).strip()[:15] or "Teman•Mabar"
            f_skin = str(data.get("skinId", "siti")).strip().lower()
            if f_skin not in VALID_SKINS:
                f_skin = "siti"
            preset = {"name": f_name, "skinId": f_skin}
            friend_key = f_skin
        else:
            friend_key = str(data or "siti").strip().lower()
            preset = FRIEND_PRESETS.get(friend_key, FRIEND_PRESETS["siti"])

        bot_id = f"bot_{friend_key}_{int(time.time()*1000)}"
        p_idx = len(room["players"])
        sp = grid_to_world(12, 6 + (p_idx % 3))

        room["players"][bot_id] = {
            "id": bot_id,
            "name": preset["name"],
            "skinId": preset["skinId"],
            "color": SKIN_COLORS.get(preset["skinId"], 0xA855F7),
            "ready": True,
            "isBot": True,
            "slotIndex": p_idx,
            "x": sp["x"] + (random.random() - 0.5) * 0.5,
            "y": 1.6,
            "z": sp["z"],
            "yaw": 0.0,
            "pitch": 0.0,
            "flashlight": True,
            "alive": True,
            "hiding": False,
            "lockerId": None,
            "inventory": [],
            "deathX": sp["x"],
            "deathZ": sp["z"],
            "botTarget": None,
        }

        inviter = room["players"].get(client_id, {}).get("name", "Pemain")
        await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"]})
        await broadcast_room(code, "lobbyChatMessage", {
            "sender": preset["name"],
            "text": f"Halo {inviter}! Aku menerima undangan mabar! Ayo kita cari 6 Konci di sekolah!",
            "isSystem": False,
        })

    elif event == "kickFriend":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        # Hapus 1 teman bot terakhir jika pemain ingin mengosongkan slot
        for pid in reversed(list(room["players"].keys())):
            if pid.startswith("bot_"):
                removed = room["players"].pop(pid)
                for idx, rem_p in enumerate(room["players"].values()):
                    rem_p["slotIndex"] = idx
                await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"]})
                await broadcast_room(code, "lobbyChatMessage", {
                    "sender": "SISTEM INVITE",
                    "text": f"{removed['name']} meninggalkan slot Squad.",
                    "isSystem": True,
                })
                break

    elif event == "changeSkin":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        p = room["players"].get(client_id)
        if not p:
            return
        if isinstance(data, dict):
            skin_id = str(data.get("skinId", p.get("skinId", "adit"))).strip().lower()
            if "outfit" in data and isinstance(data["outfit"], dict):
                p["outfit"] = data["outfit"]
        else:
            skin_id = str(data).strip().lower()
        if skin_id in VALID_SKINS:
            p["skinId"] = skin_id
            p["color"] = SKIN_COLORS.get(skin_id, 0xE2E8F0)
            await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"]})

    elif event == "changeOutfit":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        p = room["players"].get(client_id)
        if not p:
            return
        if isinstance(data, dict):
            p["outfit"] = {
                "outfitId": str(data.get("outfitId", "default"))[:24],
                "headgear": str(data.get("headgear", "default"))[:24],
                "skinTone": str(data.get("skinTone", "#f1c27d"))[:16],
                "customShirt": str(data.get("customShirt", ""))[:16],
                "customPants": str(data.get("customPants", ""))[:16],
            }
            await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"]})

    elif event == "toggleReady":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        p = room["players"].get(client_id)
        if not p:
            return
        p["ready"] = not p.get("ready", True)
        await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"]})

    elif event == "lobbyChat":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        p = room["players"].get(client_id)
        if not p:
            return
        text = str(data or "").strip()[:120]
        if text:
            await broadcast_room(code, "lobbyChatMessage", {
                "sender": p["name"],
                "text": text,
                "isSystem": False,
            })

    elif event == "startMatch":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        start_or_reset_match(room)
        await broadcast_room(code, "matchStarted", room)

    elif event in ("backToLobby", "leaveMatch"):
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        room["state"] = "lobby"
        for idx, pl in enumerate(room["players"].values()):
            pl["slotIndex"] = idx
            pl["ready"] = True
            pl["alive"] = True
            pl["hiding"] = False
            pl["inventory"] = []
        await broadcast_room(code, "returnedToLobby", room)

    elif event == "playerMove":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        p = room["players"].get(client_id)
        if not p or room["state"] != "playing":
            return
        if p["hiding"]:
            p["yaw"] = float(data.get("yaw", p["yaw"]))
            p["pitch"] = float(data.get("pitch", p["pitch"]))
            p["flashlight"] = False
            return

        p["x"] = float(data.get("x", p["x"]))
        p["y"] = float(data.get("y", 1.6))
        p["z"] = float(data.get("z", p["z"]))
        p["yaw"] = float(data.get("yaw", 0))
        p["pitch"] = float(data.get("pitch", 0))
        p["flashlight"] = bool(data.get("flashlight", True)) if p["alive"] else False

    elif event == "toggleHide":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        p = room["players"].get(client_id)
        if not p or not p["alive"] or room["state"] != "playing":
            return

        if p["hiding"]:
            for lk in room["lockers"]:
                if lk["id"] == p["lockerId"]:
                    lk["occupantId"] = None
                    p["x"] = lk["x"]
                    p["z"] = lk["z"] + 0.95
                    break
            p["hiding"] = False
            p["lockerId"] = None
            await send_event(client_id, "hideStateChanged", {"hiding": False, "lockerId": None})
            await broadcast_room(code, "lockersUpdated", room["lockers"])
            return

        nearest_lk = None
        min_d = 2.6
        for lk in room["lockers"]:
            if lk["occupantId"] is not None:
                continue
            d = math.hypot(lk["x"] - p["x"], lk["z"] - p["z"])
            if d < min_d:
                min_d = d
                nearest_lk = lk

        if nearest_lk:
            nearest_lk["occupantId"] = client_id
            p["hiding"] = True
            p["lockerId"] = nearest_lk["id"]
            p["flashlight"] = False
            p["x"] = nearest_lk["x"]
            p["z"] = nearest_lk["z"]
            await send_event(client_id, "hideStateChanged", {
                "hiding": True,
                "lockerId": nearest_lk["id"],
                "x": nearest_lk["x"],
                "z": nearest_lk["z"],
            })
            await broadcast_room(code, "lockersUpdated", room["lockers"])

    elif event == "activateCandle":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        p = room["players"].get(client_id)
        if not p or room["state"] != "playing":
            return
        if all(pl["alive"] for pl in room["players"].values()):
            return

        candle_id = str(data)
        for c in room["ritualCandles"]:
            if c["id"] == candle_id and not c["lit"]:
                if math.hypot(c["x"] - p["x"], c["z"] - p["z"]) <= 3.5:
                    c["lit"] = True
                    lit_count = sum(1 for x in room["ritualCandles"] if x["lit"])
                    room["reviveReady"] = lit_count >= 3
                    await broadcast_room(
                        code,
                        "systemMessage",
                        f"🕯️ {p['name']} menyalakan {c['name']} ({lit_count}/3)!"
                        + (" KEMBALI KE RUANG AMAN & TEKAN [H] UNTUK BANGKIT!" if room["reviveReady"] else ""),
                    )
                    await broadcast_room(code, "ritualUpdated", {
                        "ritualCandles": room["ritualCandles"],
                        "reviveReady": room["reviveReady"],
                    })
                break

    elif event == "revivePlayers":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        p = room["players"].get(client_id)
        if not p or room["state"] != "playing":
            return

        row, col = world_to_grid(p["x"], p["z"])
        if row >= 12 and 6 <= col <= 8:
            if not room["reviveReady"]:
                lit_count = sum(1 for x in room["ritualCandles"] if x["lit"])
                await send_event(
                    client_id,
                    "systemMessage",
                    f"Misi Kebangkitan belum selesai! Nyalakan 3 Segel Lilin Darah di lorong ({lit_count}/3).",
                )
                return

            revived_names = []
            sp = grid_to_world(12, 7)
            for pl in room["players"].values():
                if not pl["alive"]:
                    pl["alive"] = True
                    pl["hiding"] = False
                    pl["lockerId"] = None
                    pl["flashlight"] = True
                    pl["x"] = sp["x"] + (random.random() - 0.5) * 0.8
                    pl["z"] = sp["z"]
                    revived_names.append(pl["name"])

            if revived_names:
                room["ritualCandles"] = generate_ritual_candles()
                room["reviveReady"] = False
                await broadcast_room(
                    code,
                    "playersRevived",
                    {
                        "revivedNames": revived_names,
                        "players": room["players"],
                        "ritualCandles": room["ritualCandles"],
                        "reviveReady": False,
                    },
                )
                await broadcast_room(
                    code,
                    "systemMessage",
                    f"✨ RITUAL BERHASIL! {', '.join(revived_names)} telah dihidupkan kembali di Ruang Aman!",
                )

    elif event == "pickupScrap":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        p = room["players"].get(client_id)
        if not p or not p["alive"] or p["hiding"] or room["state"] != "playing" or len(p["inventory"]) >= 2:
            return
        scrap_id = str(data)
        reach = 3.8 if p.get("skinId") in ("maulana", "siti") else 3.2
        cur_fl = room.get("currentFloor", 1)
        for s in room["scraps"]:
            if s["id"] == scrap_id and not s["carrierId"] and not s["deposited"]:
                if s.get("keyFloor", cur_fl) != cur_fl:
                    continue
                if math.hypot(s["x"] - p["x"], s["z"] - p["z"]) <= reach:
                    s["carrierId"] = client_id
                    p["inventory"].append(s["id"])
                    await broadcast_room(code, "systemMessage", f"🔑 {p['name']} menemukan {s['name']}!")
                    await broadcast_room(code, "scrapUpdated", {
                        "scraps": room["scraps"],
                        "players": room["players"],
                    })
                break

    elif event == "dropScrap":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        p = room["players"].get(client_id)
        if not p or not p["alive"] or p["hiding"] or not p["inventory"] or room["state"] != "playing":
            return
        scrap_id = p["inventory"].pop()
        for s in room["scraps"]:
            if s["id"] == scrap_id:
                s["carrierId"] = None
                s["keyFloor"] = room.get("currentFloor", 1)
                s["x"] = p["x"] - math.sin(p["yaw"]) * 0.9
                s["z"] = p["z"] - math.cos(p["yaw"]) * 0.9
                s["y"] = 0.45
                break
        await broadcast_room(code, "scrapUpdated", {
            "scraps": room["scraps"],
            "players": room["players"],
        })

    elif event == "depositScrap":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        p = room["players"].get(client_id)
        if not p or not p["alive"] or not p["inventory"] or room["state"] != "playing":
            return
        row, col = world_to_grid(p["x"], p["z"])
        if row >= 11 and 6 <= col <= 8:
            await unlock_and_check_floor(code, room, p)

    elif event == "useStairs":
        code, room = ensure_client_in_room(client_id, current_room_ref)
        p = room["players"].get(client_id)
        if not p or not p["alive"] or p.get("hiding") or room["state"] != "playing":
            return

        target_floor = None
        stair_loc = "front"
        if isinstance(data, dict):
            stair_loc = str(data.get("stair", "front"))
            if "floor" in data:
                try:
                    target_floor = int(data["floor"])
                except Exception:
                    target_floor = None

        cur_fl = room.get("currentFloor", 1)
        if not target_floor or target_floor < 1 or target_floor > 3:
            if stair_loc == "back" and cur_fl > 1:
                target_floor = cur_fl - 1
            else:
                target_floor = (cur_fl % 3) + 1

        if target_floor == cur_fl:
            target_floor = (cur_fl % 3) + 1

        room["currentFloor"] = target_floor
        room["floorName"] = FLOOR_NAMES.get(target_floor, f"LANTAI {target_floor}")
        room["lockers"] = build_lockers()

        # Tempatkan pemain di peron tangga yang sesuai (Depan Ruang Aman atau Belakang Ruang Aman)
        if stair_loc == "back":
            landing = grid_to_world(12, 7)
        else:
            landing = grid_to_world(11, 7)
        p["x"] = landing["x"]
        p["z"] = landing["z"]

        ms = grid_to_world(3, 7)
        room["monster"]["x"] = ms["x"]
        room["monster"]["z"] = ms["z"]
        room["monster"]["state"] = "patrol"
        room["monster"]["targetPlayerId"] = None
        room["monster"]["detectTimer"] = 0.0
        room["monster"]["graceUntil"] = time.time() + 4.0

        for pl in room["players"].values():
            pl["hiding"] = False
            pl["lockerId"] = None

        stair_label = "Tangga Belakang Ruang Aman" if stair_loc == "back" else "Tangga Depan Ruang Aman"
        rem_on_floor = [s["name"] for s in room["scraps"] if not s["deposited"] and not s["carrierId"] and s.get("keyFloor") == target_floor]
        key_hint = f" (Ada {len(rem_on_floor)} Konci di lantai ini!)" if rem_on_floor else " (Semua Konci di lantai ini sudah diambil)"

        await broadcast_room(
            code,
            "systemMessage",
            f"🪜 {p['name']} lewat {stair_label} menuju LANTAI {target_floor}{key_hint}",
        )
        payload = dict(room)
        payload["isStairs"] = True
        payload["stairLabel"] = stair_label
        await broadcast_room(code, "floorAdvanced", payload)

    elif event == "extractNow":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        p = room["players"].get(client_id)
        if not p or not p["alive"] or room["state"] != "playing":
            return
        row, col = world_to_grid(p["x"], p["z"])
        if row >= 12 and 6 <= col <= 8:
            if room["quota"] >= room["targetQuota"]:
                if room["currentFloor"] < MAX_FLOORS:
                    next_floor = room["currentFloor"] + 1
                    setup_floor(room, next_floor)
                    await broadcast_room(code, "floorAdvanced", room)
                else:
                    room["state"] = "won"
                    room["endReason"] = "BOOYAH! Seluruh 4 Lantai Gedung Sekolah berhasil ditembus!"
                    await broadcast_room(code, "roundEnded", {
                        "state": room["state"],
                        "reason": room["endReason"],
                        "quota": room["quota"],
                    })
            else:
                await send_event(
                    client_id,
                    "systemMessage",
                    f"Pintu Lantai {room['currentFloor']} masih terkunci! Baru {room['quota']}/{room['targetQuota']} Gembok terbuka.",
                )

    elif event == "restartRound":
        code = current_room_ref.get("code")
        if not code or code not in rooms:
            return
        room = rooms[code]
        start_or_reset_match(room)
        await broadcast_room(code, "matchStarted", room)


async def read_ws_frame(reader: asyncio.StreamReader):
    hdr = await reader.readexactly(2)
    b1, b2 = hdr[0], hdr[1]
    opcode = b1 & 0x0F
    if opcode == 0x8:
        return None
    masked = bool(b2 & 0x80)
    length = b2 & 0x7F
    if length == 126:
        ext = await reader.readexactly(2)
        length = struct.unpack("!H", ext)[0]
    elif length == 127:
        ext = await reader.readexactly(8)
        length = struct.unpack("!Q", ext)[0]
    mask_key = await reader.readexactly(4) if masked else None
    payload = bytearray(await reader.readexactly(length))
    if masked and mask_key:
        for i in range(length):
            payload[i] ^= mask_key[i % 4]
    if opcode == 0x1:
        return payload.decode("utf-8", errors="ignore")
    return ""


async def handle_client(reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
    try:
        request_line = await reader.readline()
        if not request_line:
            writer.close()
            return
        parts = request_line.decode("utf-8", errors="ignore").strip().split()
        if len(parts) < 2:
            writer.close()
            return
        method, raw_path = parts[0], parts[1].split("?")[0]

        headers = {}
        while True:
            line = await reader.readline()
            if not line or line in (b"\r\n", b"\n"):
                break
            decoded = line.decode("utf-8", errors="ignore").strip()
            if ":" in decoded:
                k, v = decoded.split(":", 1)
                headers[k.strip().lower()] = v.strip()

        if headers.get("upgrade", "").lower() == "websocket":
            key = headers.get("sec-websocket-key", "")
            accept = base64.b64encode(
                hashlib.sha1((key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode()).digest()
            ).decode()
            handshake = (
                "HTTP/1.1 101 Switching Protocols\r\n"
                "Upgrade: websocket\r\n"
                "Connection: Upgrade\r\n"
                f"Sec-WebSocket-Accept: {accept}\r\n\r\n"
            )
            writer.write(handshake.encode("utf-8"))
            await writer.drain()

            client_id = f"p_{int(time.time()*1000)}_{random.randint(1000,9999)}"
            clients[client_id] = writer
            current_room_ref = {"code": None}

            try:
                while True:
                    msg = await read_ws_frame(reader)
                    if msg is None:
                        break
                    if msg:
                        await handle_ws_message(client_id, current_room_ref, msg)
            except Exception:
                pass
            finally:
                clients.pop(client_id, None)
                code = current_room_ref.get("code")
                if code and code in rooms:
                    room = rooms[code]
                    p = room["players"].pop(client_id, None)
                    if p:
                        if p.get("lockerId"):
                            for lk in room["lockers"]:
                                if lk["id"] == p["lockerId"]:
                                    lk["occupantId"] = None
                        for sid in p["inventory"]:
                            for s in room["scraps"]:
                                if s["id"] == sid:
                                    s["carrierId"] = None
                                    s["x"] = p["x"]
                                    s["z"] = p["z"]
                        for idx, rem_p in enumerate(room["players"].values()):
                            rem_p["slotIndex"] = idx
                        await broadcast_room(code, "lobbyUpdated", {"players": room["players"], "state": room["state"]})
                writer.close()
            return

        if raw_path == "/":
            raw_path = "/index.html"

        clean_path = unquote(raw_path).lstrip("/")
        file_path = (PUBLIC_DIR / clean_path).resolve()
        if clean_path == "lobby-bg.jpeg" and not file_path.is_file() and STAGE_PHOTO_SOURCE.is_file():
            file_path = STAGE_PHOTO_SOURCE.resolve()
        elif not str(file_path).startswith(str(PUBLIC_DIR.resolve())) or not file_path.is_file():
            body = b"404 Not Found"
            writer.write(
                f"HTTP/1.1 404 Not Found\r\nContent-Length: {len(body)}\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n".encode() + body
            )
            await writer.drain()
            writer.close()
            return

        content = file_path.read_bytes()
        mime, _ = mimetypes.guess_type(str(file_path))
        mime = mime or "application/octet-stream"
        header = (
            f"HTTP/1.1 200 OK\r\n"
            f"Content-Type: {mime}\r\n"
            f"Content-Length: {len(content)}\r\n"
            f"Cache-Control: no-store, no-cache, must-revalidate, max-age=0\r\n"
            f"Access-Control-Allow-Origin: *\r\n"
            f"Connection: close\r\n\r\n"
        ).encode("utf-8")
        writer.write(header + content)
        await writer.drain()
        writer.close()
        try:
            await writer.wait_closed()
        except Exception:
            pass
    except Exception:
        try:
            writer.close()
        except Exception:
            pass


async def game_loop():
    dt = 0.05  # 20 Tick per detik
    while True:
        await asyncio.sleep(dt)
        now = time.time()

        for code, room in list(rooms.items()):
            if room["state"] != "playing":
                continue
            players = list(room["players"].values())
            if not players:
                continue

            # Update AI Teman Squad yang Di-invite (Membantu cari kunci di lantai saat ini & bawa ke Ruang Aman!)
            safe_pos = grid_to_world(12, 7)
            cur_fl = room.get("currentFloor", 1)
            for p in players:
                if not p.get("isBot") or not p["alive"] or p.get("hiding"):
                    continue
                # Jika teman bot sudah bawa kunci, jalan kembali ke Ruang Aman untuk buka gembok!
                if len(p["inventory"]) > 0:
                    target = safe_pos
                    dx = target["x"] - p["x"]
                    dz = target["z"] - p["z"]
                    dist = math.hypot(dx, dz)
                    if dist < 1.8:
                        await unlock_and_check_floor(code, room, p)
                        continue
                else:
                    # Cari kunci terdekat di lantai saat ini yang belum diambil
                    avail_keys = [
                        s for s in room["scraps"]
                        if not s["carrierId"] and not s["deposited"] and s.get("keyFloor", cur_fl) == cur_fl
                    ]
                    if avail_keys:
                        nearest_k = min(avail_keys, key=lambda k: math.hypot(k["x"] - p["x"], k["z"] - p["z"]))
                        target = {"x": nearest_k["x"], "z": nearest_k["z"]}
                        dx = target["x"] - p["x"]
                        dz = target["z"] - p["z"]
                        dist = math.hypot(dx, dz)
                        if dist < 1.8:
                            nearest_k["carrierId"] = p["id"]
                            p["inventory"].append(nearest_k["id"])
                            await broadcast_room(code, "systemMessage", f"🔑 {p['name']} menemukan {nearest_k['name']}!")
                            await broadcast_room(code, "scrapUpdated", {"scraps": room["scraps"], "players": room["players"]})
                            continue
                    else:
                        target = safe_pos
                        dx = target["x"] - p["x"]
                        dz = target["z"] - p["z"]
                        dist = math.hypot(dx, dz)

                if dist > 0.2:
                    p["yaw"] = math.atan2(-dx, -dz)
                    b_speed = 3.3
                    sx = (dx / dist) * b_speed * dt
                    sz = (dz / dist) * b_speed * dt
                    if is_walkable(p["x"] + sx, p["z"], True):
                        p["x"] += sx
                    if is_walkable(p["x"], p["z"] + sz, True):
                        p["z"] += sz

            # AI Hantu 3D (Skin_Wahyu.glb) — Deteksi Lebih Bertahap & Kecepatan Diperlambat
            m = room["monster"]
            was_state = m.get("state", "patrol")
            closest = None
            min_score = float("inf")

            # Masa tenang awal lantai agar hantu tidak langsung mendeteksi saat pintu baru dibuka
            in_grace_period = now < m.get("graceUntil", 0.0)

            if not in_grace_period:
                for p in players:
                    if not p["alive"] or p.get("hiding"):
                        continue
                    r, c = world_to_grid(p["x"], p["z"])
                    # Zona Aman di sekitar Pintu Lantai (baris 12..13, kolom 6..8) aman dari deteksi hantu
                    if r >= 12 and 6 <= c <= 8:
                        continue

                    d = math.hypot(p["x"] - m["x"], p["z"] - m["z"])
                    los = has_line_of_sight(m["x"], m["z"], p["x"], p["z"])
                    flashlight_on = bool(p.get("flashlight"))

                    # Batas jarak deteksi agar hantu tidak mendeteksi dari ujung map:
                    # - Jika terhalang tembok (tanpa LOS): hanya mendeteksi jika jarak sangat dekat (7.5m / 10m senter nyala)
                    # - Jika terlihat langsung di lorong (LOS): mendeteksi dalam jarak menengah (12.5m / 16.5m senter nyala)
                    # - Jika sudah sedang mengejar target ini, jaga jarak kejaran hingga 18.5m
                    if was_state == "chase" and m.get("targetPlayerId") == p["id"]:
                        max_detect_dist = 18.5 if los else 13.5
                    elif los:
                        max_detect_dist = 16.5 if flashlight_on else 12.5
                    else:
                        max_detect_dist = 10.0 if flashlight_on else 7.2

                    if d > max_detect_dist:
                        continue

                    score = d
                    if not p.get("isBot"):
                        score *= 0.85
                    if flashlight_on:
                        score *= 0.9
                    if los:
                        score *= 0.8
                    if score < min_score:
                        min_score = score
                        closest = p

            # Tambahkan jeda reaksi deteksi (~0.9 detik) sebelum hantu benar-benar berubah dari patroli ke mengejar
            if closest:
                if was_state != "chase":
                    m["detectTimer"] = m.get("detectTimer", 0.0) + dt
                    if m["detectTimer"] < 0.9:
                        closest = None
                else:
                    m["detectTimer"] = 0.9
            else:
                m["detectTimer"] = max(0.0, m.get("detectTimer", 0.0) - dt * 1.5)

            if closest:
                m["state"] = "chase"
                m["targetPlayerId"] = closest["id"]

                if was_state != "chase" or (now - m.get("lastLaughTime", 0)) >= 5.5:
                    m["lastLaughTime"] = now
                    await broadcast_room(code, "kuntiLaugh", {
                        "x": m["x"],
                        "z": m["z"],
                        "targetName": closest["name"],
                    })

                dist = math.hypot(closest["x"] - m["x"], closest["z"] - m["z"])
                los = has_line_of_sight(m["x"], m["z"], closest["x"], closest["z"])

                if dist > 0.05:
                    if los:
                        # Kecepatan kejar saat terlihat langsung (diperlambat agar player bisa lari menghindar)
                        steer_target = {"x": closest["x"], "z": closest["z"]}
                        speed = 3.45 + (room["currentFloor"] - 1) * 0.14
                    else:
                        # Kecepatan kejar saat berbelok di lorong (BFS Pathfinding)
                        steer_target = find_next_path_world(m["x"], m["z"], closest["x"], closest["z"])
                        speed = 3.05 + (room["currentFloor"] - 1) * 0.12

                    move_monster_toward(m, steer_target["x"], steer_target["z"], speed, dt)

                if dist < 1.28:
                    closest["alive"] = False
                    closest["flashlight"] = False
                    closest["deathX"] = closest["x"]
                    closest["deathZ"] = closest["z"]
                    for sid in closest["inventory"]:
                        for s in room["scraps"]:
                            if s["id"] == sid:
                                s["carrierId"] = None
                                s["x"] = closest["x"] + (random.random() - 0.5) * 0.8
                                s["z"] = closest["z"] + (random.random() - 0.5) * 0.8
                                s["y"] = 0.45
                    closest["inventory"] = []

                    ms = grid_to_world(3, 7)
                    m["x"] = ms["x"]
                    m["z"] = ms["z"]
                    m["state"] = "patrol"
                    m["targetPlayerId"] = None
                    m["detectTimer"] = 0.0
                    m["graceUntil"] = now + 3.5

                    await broadcast_room(code, "playerKilled", {
                        "victimId": closest["id"],
                        "victimName": closest["name"],
                        "scraps": room["scraps"],
                        "ritualCandles": room["ritualCandles"],
                        "reviveReady": room["reviveReady"],
                    })
                    await broadcast_room(
                        code,
                        "systemMessage",
                        f"💀 {closest['name']} DITERKAM HANTU! Nyalakan 3 Segel Lilin Darah di lorong lalu tekan [H] di Ruang Aman!",
                    )
            else:
                m["state"] = "patrol"
                m["targetPlayerId"] = None

                if (now - m.get("lastLaughTime", 0)) >= 10.0:
                    m["lastLaughTime"] = now
                    await broadcast_room(code, "kuntiLaugh", {
                        "x": m["x"],
                        "z": m["z"],
                        "targetName": None,
                    })

                wp = m.get("waypoint")
                if not wp or math.hypot(wp["x"] - m["x"], wp["z"] - m["z"]) < 1.0:
                    patrol_cells = [(3, 3), (3, 7), (3, 11), (5, 5), (5, 9), (7, 3), (7, 7), (7, 11), (9, 5), (9, 9)]
                    r, c = random.choice(patrol_cells)
                    m["waypoint"] = grid_to_world(r, c)
                    wp = m["waypoint"]

                steer_wp = find_next_path_world(m["x"], m["z"], wp["x"], wp["z"])
                # Kecepatan patroli santai (2.15)
                moved = move_monster_toward(m, steer_wp["x"], steer_wp["z"], 2.15, dt)
                if not moved:
                    m["waypoint"] = None

            await broadcast_room(code, "worldTick", {
                "players": room["players"],
                "monster": room["monster"],
                "quota": room["quota"],
                "currentFloor": room["currentFloor"],
                "floorName": room["floorName"],
                "reviveReady": room["reviveReady"],
            })


async def main():
    server = await asyncio.start_server(handle_client, "0.0.0.0", PORT)
    print(f"[DARAH SKANTRI] Server Multiplayer 3D berjalan di http://localhost:{PORT}")
    asyncio.create_task(game_loop())
    async with server:
        await server.serve_forever()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
