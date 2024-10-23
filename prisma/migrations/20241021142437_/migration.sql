/*
  Warnings:

  - You are about to drop the column `cargo` on the `usuarios` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Funcionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "endereco" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "NdePedidos" INTEGER NOT NULL DEFAULT 0,
    "carteira" TEXT,
    "numero" INTEGER,
    "complemento" TEXT,
    "ponto_de_referencia" TEXT
);
INSERT INTO "new_usuarios" ("NdePedidos", "carteira", "complemento", "email", "id", "numero", "password", "ponto_de_referencia", "username") SELECT "NdePedidos", "carteira", "complemento", "email", "id", "numero", "password", "ponto_de_referencia", "username" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
