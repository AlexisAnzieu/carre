/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Expeditioner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthday` to the `Expeditioner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expeditioner` ADD COLUMN `birthday` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Expeditioner_name_key` ON `Expeditioner`(`name`);
