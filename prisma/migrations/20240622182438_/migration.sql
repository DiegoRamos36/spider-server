-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pedidos" INTEGER NOT NULL DEFAULT 0,
    "cargo" TEXT NOT NULL DEFAULT 'cliente',
    "carteira" TEXT,
    "endereco" TEXT,
    "numero" INTEGER,
    "complemento" TEXT,
    "ponto_de_referencia" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
