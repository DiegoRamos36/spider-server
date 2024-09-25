-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "NdePedidos" INTEGER NOT NULL DEFAULT 0,
    "pedidos" TEXT NOT NULL DEFAULT '',
    "cargo" TEXT NOT NULL DEFAULT 'cliente',
    "carteira" TEXT,
    "endereco" TEXT,
    "numero" INTEGER,
    "complemento" TEXT,
    "ponto_de_referencia" TEXT
);
INSERT INTO "new_usuarios" ("cargo", "carteira", "complemento", "email", "endereco", "id", "numero", "password", "pedidos", "ponto_de_referencia", "username") SELECT "cargo", "carteira", "complemento", "email", "endereco", "id", "numero", "password", "pedidos", "ponto_de_referencia", "username" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
