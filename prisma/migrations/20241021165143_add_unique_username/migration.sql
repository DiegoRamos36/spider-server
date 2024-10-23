/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Funcionarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Funcionarios_username_key" ON "Funcionarios"("username");
