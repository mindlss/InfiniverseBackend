const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Название города должно быть уникальным
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country', // Ссылка на страну
      required: true,
    },
  },
  {
    timestamps: true, // Добавляет поля createdAt и updatedAt
  }
);

/**
 * Модель City представляет города в системе.
 * 
 * Поля:
 * - `name` (String): Название города, уникальное для базы данных.
 * - `country` (ObjectId): Ссылка на страну (Country), к которой принадлежит город.
 * - `createdAt` (Date): Дата создания города (автоматически добавляется Mongoose).
 * - `updatedAt` (Date): Дата последнего обновления города (автоматически добавляется Mongoose).
 */

const City = mongoose.model('City', citySchema);
module.exports = City;
