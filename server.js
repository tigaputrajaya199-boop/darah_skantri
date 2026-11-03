const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const STAGE_PHOTO_SOURCE = '/home/adit/Downloads/WhatsApp Image 2026-11-03 at 07.00.05.jpeg';
const STAGE_PHOTO_DEST = path.join(__dirname, 'public', 'lobby-bg.jpeg');
try {
  if (fs.existsSync(STAGE_PHOTO_SOURCE)) {
    fs.copyFileSync(STAGE_PHOTO_SOURCE, STAGE_PHOTO_DEST);
  }
} catch (e) {}

app.get('/lobby-bg.jpeg', (req, res, next) => {
  if (fs.existsSync(STAGE_PHOTO_DEST)) {
    return res.sendFile(STAGE_PHOTO_DEST);
  }
  if (fs.existsSync(STAGE_PHOTO_SOURCE)) {
    return res.sendFile(STAGE_PHOTO_SOURCE);
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi Map Gedung "Skantri" (1 = Dinding, 0 = Lorong/Ruangan, 2 = Zona Aman / Posko)
// Ukuran Grid: 15x15 (Setiap sel berukuran 4x4 meter di dunia 3D)
const CELL_SIZE = 4;
const MAP_GRID = [
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
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const SCRAP_TYPES = [
  { name: 'Cawan Darah Kuno', value: 65, color: 0xb30000, shape: 'chalice' },
  { name: 'Kitab Skantri', value: 80, color: 0x6b2d5c, shape: 'book' },
  { name: 'Lentera Karat', value: 45, color: 0xd97706, shape: 'lantern' },
  { name: 'Keris Pusaka', value: 95, color: 0xfbbf24, shape: 'dagger' },
  { name: 'Kotak Musik Tua', value: 55, color: 0x38bdf8, shape: 'box' },
  { name: 'Tengkorak Ritual', value: 70, color: 0xe5e7eb, shape: 'skull' },
  { name: 'Kunci Ruang Bawah', value: 40, color: 0xa3e635, shape: 'key' },
  { name: 'Patung Merah', value: 85, color: 0xef4444, shape: 'statue' }
];

const PLAYER_COLORS = [0x38bdf8, 0x4ade80, 0xfacc15, 0xc084fc];
const QUOTA_TARGET = 300;
const ROUND_DURATION = 180; // 3 menit

const rooms = new Map();

function gridToWorld(row, col) {
  const offset = (MAP_GRID.length * CELL_SIZE) / 2;
  return {
    x: col * CELL_SIZE - offset + CELL_SIZE / 2,
    z: row * CELL_SIZE - offset + CELL_SIZE / 2
  };
}

function worldToGrid(x, z) {
  const offset = (MAP_GRID.length * CELL_SIZE) / 2;
  const col = Math.floor((x + offset) / CELL_SIZE);
  const row = Math.floor((z + offset) / CELL_SIZE);
  return { row, col };
}

function isWalkable(x, z, allowSafeZone = false) {
  const { row, col } = worldToGrid(x, z);
  if (row < 0 || row >= MAP_GRID.length || col < 0 || col >= MAP_GRID[0].length) return false;
  const cell = MAP_GRID[row][col];
  if (cell === 1) return false;
  if (cell === 2 && !allowSafeZone) return false;
  return true;
}

function hasLineOfSight(x1, z1, x2, z2) {
  const dist = Math.hypot(x2 - x1, z2 - z1);
  if (dist < 0.2) return true;
  const steps = Math.max(2, Math.floor(dist / 0.55));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (!isWalkable(x1 + (x2 - x1) * t, z1 + (z2 - z1) * t, false)) return false;
  }
  return true;
}

function findNextPathWorld(mx, mz, tx, tz) {
  const start = worldToGrid(mx, mz);
  const target = worldToGrid(tx, tz);
  if (start.row === target.row && start.col === target.col) return { x: tx, z: tz };

  const rows = MAP_GRID.length;
  const cols = MAP_GRID[0].length;
  const key = (r, c) => `${r},${c}`;
  const queue = [[start.row, start.col]];
  const parent = new Map([[key(start.row, start.col), null]]);
  let found = false;

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (r === target.row && c === target.col) {
      found = true;
      break;
    }
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = key(nr, nc);
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !parent.has(nk)) {
        if (MAP_GRID[nr][nc] === 0 || (nr === target.row && nc === target.col && MAP_GRID[nr][nc] !== 1)) {
          parent.set(nk, [r, c]);
          queue.push([nr, nc]);
        }
      }
    }
  }

  if (!found) return { x: tx, z: tz };
  const path = [];
  let cur = [target.row, target.col];
  while (cur && !(cur[0] === start.row && cur[1] === start.col)) {
    path.push(cur);
    cur = parent.get(key(cur[0], cur[1]));
  }
  path.reverse();
  if (path.length === 0) return { x: tx, z: tz };
  let wp = gridToWorld(path[0][0], path[0][1]);
  if (path.length > 1 && Math.hypot(wp.x - mx, wp.z - mz) < 0.85) {
    wp = gridToWorld(path[1][0], path[1][1]);
  }
  return wp;
}

function getValidScrapSpawns() {
  const spawns = [];
  for (let r = 1; r < MAP_GRID.length - 3; r++) {
    for (let c = 1; c < MAP_GRID[0].length - 1; c++) {
      if (MAP_GRID[r][c] === 0) {
        spawns.push({ row: r, col: c });
      }
    }
  }
  return spawns;
}

function generateScraps(count = 10) {
  const validCells = getValidScrapSpawns();
  // Acak urutan sel
  for (let i = validCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validCells[i], validCells[j]] = [validCells[j], validCells[i]];
  }

  const items = [];
  for (let i = 0; i < Math.min(count, validCells.length); i++) {
    const cell = validCells[i];
    const worldPos = gridToWorld(cell.row, cell.col);
    const type = SCRAP_TYPES[i % SCRAP_TYPES.length];
    items.push({
      id: `scrap_${i}_${Date.now()}`,
      name: type.name,
      value: type.value,
      color: type.color,
      shape: type.shape,
      x: worldPos.x + (Math.random() - 0.5) * 1.4,
      y: 0.45,
      z: worldPos.z + (Math.random() - 0.5) * 1.4,
      carrierId: null,
      deposited: false
    });
  }
  return items;
}

function createRoom(code) {
  const monsterStart = gridToWorld(1, 7);
  const room = {
    code,
    state: 'playing', // 'playing' | 'won' | 'lost'
    endReason: '',
    quota: 0,
    targetQuota: QUOTA_TARGET,
    timeLeft: ROUND_DURATION,
    lastTimerTick: Date.now(),
    players: {},
    scraps: generateScraps(10),
    monster: {
      x: monsterStart.x,
      z: monsterStart.z,
      yaw: 0,
      state: 'patrol', // 'patrol' | 'chase'
      targetPlayerId: null,
      waypoint: null
    }
  };
  rooms.set(code, room);
  return room;
}

function resetRoom(room) {
  const monsterStart = gridToWorld(1, 7);
  room.state = 'playing';
  room.endReason = '';
  room.quota = 0;
  room.timeLeft = ROUND_DURATION;
  room.lastTimerTick = Date.now();
  room.scraps = generateScraps(10);
  room.monster = {
    x: monsterStart.x,
    z: monsterStart.z,
    yaw: 0,
    state: 'patrol',
    targetPlayerId: null,
    waypoint: null
  };

  const spawnPoints = [
    gridToWorld(13, 6),
    gridToWorld(13, 7),
    gridToWorld(13, 8),
    { x: gridToWorld(13, 7).x, z: gridToWorld(13, 7).z + 0.8 }
  ];

  let idx = 0;
  for (const pid of Object.keys(room.players)) {
    const p = room.players[pid];
    const sp = spawnPoints[idx % spawnPoints.length];
    p.x = sp.x;
    p.y = 1.6;
    p.z = sp.z;
    p.yaw = 0;
    p.pitch = 0;
    p.alive = true;
    p.flashlight = true;
    p.inventory = [];
    idx++;
  }
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

io.on('connection', (socket) => {
  let currentRoomCode = null;

  socket.on('joinRoom', ({ username, roomCode }) => {
    const cleanName = (username || 'Pencari').trim().substring(0, 16) || 'Pencari';
    let code = (roomCode || '').trim().toUpperCase();

    if (!code) {
      code = generateRoomCode();
      createRoom(code);
    } else if (!rooms.has(code)) {
      createRoom(code);
    }

    const room = rooms.get(code);
    if (Object.keys(room.players).length >= 4) {
      socket.emit('joinError', 'Room sudah penuh (Maksimal 4 pemain).');
      return;
    }

    currentRoomCode = code;
    socket.join(code);

    const playerIndex = Object.keys(room.players).length;
    const spawnCell = gridToWorld(13, 6 + (playerIndex % 3));

    room.players[socket.id] = {
      id: socket.id,
      name: cleanName,
      color: PLAYER_COLORS[playerIndex % PLAYER_COLORS.length],
      x: spawnCell.x + (Math.random() - 0.5) * 0.6,
      y: 1.6,
      z: spawnCell.z,
      yaw: 0,
      pitch: 0,
      flashlight: true,
      alive: true,
      inventory: []
    };

    socket.emit('joinedRoom', {
      playerId: socket.id,
      roomCode: code,
      mapGrid: MAP_GRID,
      cellSize: CELL_SIZE,
      state: room
    });

    io.to(code).emit('systemMessage', `${cleanName} memasuki bangunan Skantri.`);
  });

  socket.on('playerMove', (data) => {
    if (!currentRoomCode || !rooms.has(currentRoomCode)) return;
    const room = rooms.get(currentRoomCode);
    const p = room.players[socket.id];
    if (!p || !p.alive || room.state !== 'playing') return;

    p.x = Number(data.x) || p.x;
    p.y = Number(data.y) || 1.6;
    p.z = Number(data.z) || p.z;
    p.yaw = Number(data.yaw) || 0;
    p.pitch = Number(data.pitch) || 0;
    p.flashlight = Boolean(data.flashlight);
  });

  socket.on('pickupScrap', (scrapId) => {
    if (!currentRoomCode || !rooms.has(currentRoomCode)) return;
    const room = rooms.get(currentRoomCode);
    const p = room.players[socket.id];
    if (!p || !p.alive || room.state !== 'playing') return;
    if (p.inventory.length >= 2) return; // Maksimal 2 barang

    const scrap = room.scraps.find((s) => s.id === scrapId && !s.carrierId && !s.deposited);
    if (!scrap) return;

    const dist = Math.hypot(scrap.x - p.x, scrap.z - p.z);
    if (dist <= 3.2) {
      scrap.carrierId = p.id;
      p.inventory.push(scrap.id);
      io.to(currentRoomCode).emit('scrapUpdated', { scraps: room.scraps, players: room.players });
    }
  });

  socket.on('dropScrap', () => {
    if (!currentRoomCode || !rooms.has(currentRoomCode)) return;
    const room = rooms.get(currentRoomCode);
    const p = room.players[socket.id];
    if (!p || !p.alive || p.inventory.length === 0 || room.state !== 'playing') return;

    const scrapId = p.inventory.pop();
    const scrap = room.scraps.find((s) => s.id === scrapId);
    if (scrap) {
      scrap.carrierId = null;
      scrap.x = p.x - Math.sin(p.yaw) * 0.9;
      scrap.z = p.z - Math.cos(p.yaw) * 0.9;
      scrap.y = 0.45;
      io.to(currentRoomCode).emit('scrapUpdated', { scraps: room.scraps, players: room.players });
    }
  });

  socket.on('depositScrap', () => {
    if (!currentRoomCode || !rooms.has(currentRoomCode)) return;
    const room = rooms.get(currentRoomCode);
    const p = room.players[socket.id];
    if (!p || !p.alive || p.inventory.length === 0 || room.state !== 'playing') return;

    // Cek apakah pemain di Zona Aman (baris 12-13, kolom 6-8)
    const { row, col } = worldToGrid(p.x, p.z);
    if (row >= 12 && col >= 6 && col <= 8) {
      let totalAdded = 0;
      while (p.inventory.length > 0) {
        const scrapId = p.inventory.pop();
        const scrap = room.scraps.find((s) => s.id === scrapId);
        if (scrap && !scrap.deposited) {
          scrap.carrierId = null;
          scrap.deposited = true;
          room.quota += scrap.value;
          totalAdded += scrap.value;
        }
      }
      if (totalAdded > 0) {
        io.to(currentRoomCode).emit('systemMessage', `${p.name} menyetorkan pusaka senilai ${totalAdded} Poin!`);
        io.to(currentRoomCode).emit('scrapUpdated', {
          scraps: room.scraps,
          players: room.players,
          quota: room.quota
        });
      }
    }
  });

  socket.on('extractNow', () => {
    if (!currentRoomCode || !rooms.has(currentRoomCode)) return;
    const room = rooms.get(currentRoomCode);
    const p = room.players[socket.id];
    if (!p || !p.alive || room.state !== 'playing') return;

    const { row, col } = worldToGrid(p.x, p.z);
    if (row >= 12 && col >= 6 && col <= 8) {
      if (room.quota >= room.targetQuota) {
        room.state = 'won';
        room.endReason = `BERHASIL KABUR! Tim mengumpulkan ${room.quota} / ${room.targetQuota} Poin Pusaka dari gedung Skantri!`;
        io.to(currentRoomCode).emit('roundEnded', {
          state: room.state,
          reason: room.endReason,
          quota: room.quota
        });
      } else {
        socket.emit('systemMessage', `Kuota belum cukup! (${room.quota}/${room.targetQuota} Poin). Kumpulkan lebih banyak pusaka!`);
      }
    }
  });

  socket.on('restartRound', () => {
    if (!currentRoomCode || !rooms.has(currentRoomCode)) return;
    const room = rooms.get(currentRoomCode);
    resetRoom(room);
    io.to(currentRoomCode).emit('roundRestarted', room);
  });

  socket.on('disconnect', () => {
    if (!currentRoomCode || !rooms.has(currentRoomCode)) return;
    const room = rooms.get(currentRoomCode);
    const p = room.players[socket.id];
    if (p) {
      // Jatuhkan semua barang yang sedang dibawa
      for (const scrapId of p.inventory) {
        const scrap = room.scraps.find((s) => s.id === scrapId);
        if (scrap) {
          scrap.carrierId = null;
          scrap.x = p.x;
          scrap.z = p.z;
        }
      }
      io.to(currentRoomCode).emit('systemMessage', `${p.name} terputus dari ekspedisi.`);
      delete room.players[socket.id];
    }

    if (Object.keys(room.players).length === 0) {
      rooms.delete(currentRoomCode);
    }
  });
});

// Loop AI "Penunggu Skantri" & Sinkronisasi Server (20 Tick per detik)
const TICK_RATE = 20;
const DT = 1 / TICK_RATE;

setInterval(() => {
  const now = Date.now();

  for (const [code, room] of rooms.entries()) {
    if (room.state !== 'playing') continue;

    const playerList = Object.values(room.players);
    if (playerList.length === 0) continue;

    // Update Timer setiap 1 detik
    if (now - room.lastTimerTick >= 1000) {
      room.timeLeft = Math.max(0, room.timeLeft - 1);
      room.lastTimerTick = now;

      if (room.timeLeft <= 0) {
        // Cek apakah kuota tercapai dan ada pemain hidup di Zona Aman
        const anySafeAlive = playerList.some((p) => {
          if (!p.alive) return false;
          const g = worldToGrid(p.x, p.z);
          return g.row >= 12 && g.col >= 6 && g.col <= 8;
        });

        if (room.quota >= room.targetQuota && anySafeAlive) {
          room.state = 'won';
          room.endReason = `WAKTU HABIS! Tim berhasil selamat di Gerbang Posko dengan ${room.quota} Poin!`;
        } else {
          room.state = 'lost';
          room.endReason = `GERBANG TERKUNCI SELAMANYA! Waktu habis dan kutukan Darah Skantri menelan timmu.`;
        }
        io.to(code).emit('roundEnded', {
          state: room.state,
          reason: room.endReason,
          quota: room.quota
        });
        continue;
      }
    }

    // Update AI Monster "Hantu Wahyu 3D" (Mengejar Player Ala Peta Eta Roblox)
    const m = room.monster;
    let closestTarget = null;
    let minEffectiveDist = Infinity;

    for (const p of playerList) {
      if (!p.alive) continue;
      // Monster tidak bisa masuk ke Zona Aman (Posko baris 12..13)
      const g = worldToGrid(p.x, p.z);
      if (g.row >= 12 && g.col >= 6 && g.col <= 8) continue;

      const dist = Math.hypot(p.x - m.x, p.z - m.z);
      const los = hasLineOfSight(m.x, m.z, p.x, p.z);
      const maxDetectDist = los ? (p.flashlight ? 16.5 : 12.5) : (p.flashlight ? 10.0 : 7.2);
      if (dist > maxDetectDist) continue;

      const effectiveDist = dist * (p.flashlight ? 0.9 : 1.0) * (los ? 0.8 : 1.0);

      if (effectiveDist < minEffectiveDist) {
        minEffectiveDist = effectiveDist;
        closestTarget = p;
      }
    }

    if (closestTarget) {
      m.detectTimer = (m.detectTimer || 0) + DT;
      if (m.state !== 'chase' && m.detectTimer < 0.9) {
        closestTarget = null;
      }
    } else {
      m.detectTimer = Math.max(0, (m.detectTimer || 0) - DT * 1.5);
    }

    if (closestTarget) {
      m.state = 'chase';
      m.targetPlayerId = closestTarget.id;

      const dist = Math.hypot(closestTarget.x - m.x, closestTarget.z - m.z);
      const los = hasLineOfSight(m.x, m.z, closestTarget.x, closestTarget.z);
      const steerTarget = los
        ? { x: closestTarget.x, z: closestTarget.z }
        : findNextPathWorld(m.x, m.z, closestTarget.x, closestTarget.z);

      const dx = steerTarget.x - m.x;
      const dz = steerTarget.z - m.z;
      const sDist = Math.hypot(dx, dz);

      if (sDist > 0.05) {
        m.yaw = Math.atan2(dx, dz);
        const speed = los ? 3.45 : 3.05;
        const stepX = (dx / sDist) * speed * DT;
        const stepZ = (dz / sDist) * speed * DT;

        if (isWalkable(m.x + stepX, m.z, false)) {
          m.x += stepX;
        }
        if (isWalkable(m.x, m.z + stepZ, false)) {
          m.z += stepZ;
        }
      }

      // Cek apakah monster menangkap pemain
      if (dist < 1.35) {
        closestTarget.alive = false;
        closestTarget.flashlight = false;

        // Jatuhkan barang yang dibawa korban
        for (const scrapId of closestTarget.inventory) {
          const scrap = room.scraps.find((s) => s.id === scrapId);
          if (scrap) {
            scrap.carrierId = null;
            scrap.x = closestTarget.x + (Math.random() - 0.5) * 0.8;
            scrap.z = closestTarget.z + (Math.random() - 0.5) * 0.8;
            scrap.y = 0.45;
          }
        }
        closestTarget.inventory = [];

        io.to(code).emit('playerKilled', {
          victimId: closestTarget.id,
          victimName: closestTarget.name,
          scraps: room.scraps
        });

        // Cek apakah semua pemain sudah gugur
        const anyAlive = playerList.some((p) => p.alive);
        if (!anyAlive) {
          room.state = 'lost';
          room.endReason = 'SELURUH TIM GUGUR! Penunggu Skantri telah menghabisi semua pencari.';
          io.to(code).emit('roundEnded', {
            state: room.state,
            reason: room.endReason,
            quota: room.quota
          });
          continue;
        }
      }
    } else {
      m.state = 'patrol';
      m.targetPlayerId = null;

      if (!m.waypoint || Math.hypot(m.waypoint.x - m.x, m.waypoint.z - m.z) < 1.0) {
        const spawns = getValidScrapSpawns();
        const pick = spawns[Math.floor(Math.random() * spawns.length)];
        m.waypoint = gridToWorld(pick.row, pick.col);
      }

      const dx = m.waypoint.x - m.x;
      const dz = m.waypoint.z - m.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.05) {
        m.yaw = Math.atan2(dx, dz);
        const speed = 2.15; // Kecepatan patroli
        const stepX = (dx / dist) * speed * DT;
        const stepZ = (dz / dist) * speed * DT;

        let moved = false;
        if (isWalkable(m.x + stepX, m.z, false)) {
          m.x += stepX;
          moved = true;
        }
        if (isWalkable(m.x, m.z + stepZ, false)) {
          m.z += stepZ;
          moved = true;
        }
        if (!moved) {
          // Ganti waypoint jika terhalang dinding
          m.waypoint = null;
        }
      }
    }

    // Broadcast state ke semua pemain di room
    io.to(code).emit('worldTick', {
      players: room.players,
      monster: room.monster,
      timeLeft: room.timeLeft,
      quota: room.quota
    });
  }
}, 1000 / TICK_RATE);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[DARAH SKANTRI] Server Multiplayer 3D berjalan di http://localhost:${PORT}`);
});
