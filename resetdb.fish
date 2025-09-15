#!/usr/bin/env fish

echo "📁 Masuk ke folder server..."
cd server

echo "🗑️ Menghapus database lama..."
mysql -u root -e "DROP DATABASE IF EXISTS baitulmalacehtengah_db;" || echo "❌ Gagal drop database"

echo "🆕 Membuat database baitulmalacehtengah_db dengan charset utf8mb4 dan collation utf8mb4_general_ci..."
mysql -u root -e "CREATE DATABASE baitulmalacehtengah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;" || echo "❌ Gagal create database"

echo "⏳ Tunggu sebentar biar MySQL siap..."
sleep 2

echo "🚀 Menjalankan Sequelize migrations..."
npx sequelize-cli db:migrate

echo "🌱 Seeding data awal..."
npx sequelize-cli db:seed:all

echo "🚀 jalankan server"
npm run start

