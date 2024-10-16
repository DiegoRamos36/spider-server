/*
  Warnings:

  - You are about to drop the column `endereco` on the `usuarios` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Enderecos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "padrao" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Enderecos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Enderecos" ("address", "bairro", "id", "nome", "numero", "reference", "userId") SELECT "address", "bairro", "id", "nome", "numero", "reference", "userId" FROM "Enderecos";
DROP TABLE "Enderecos";
ALTER TABLE "new_Enderecos" RENAME TO "Enderecos";
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "NdePedidos" INTEGER NOT NULL DEFAULT 0,
    "cargo" TEXT NOT NULL DEFAULT 'cliente',
    "carteira" TEXT,
    "numero" INTEGER,
    "complemento" TEXT,
    "ponto_de_referencia" TEXT
);
INSERT INTO "new_usuarios" ("NdePedidos", "cargo", "carteira", "complemento", "email", "id", "numero", "password", "ponto_de_referencia", "username") SELECT "NdePedidos", "cargo", "carteira", "complemento", "email", "id", "numero", "password", "ponto_de_referencia", "username" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
