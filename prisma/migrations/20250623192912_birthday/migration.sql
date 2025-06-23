/*
  Warnings:

  - A unique constraint covering the columns `[name,birthday]` on the table `Expeditioner` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Expeditioner_name_key` ON `Expeditioner`;

-- CreateIndex
CREATE UNIQUE INDEX `Expeditioner_name_birthday_key` ON `Expeditioner`(`name`, `birthday`);
