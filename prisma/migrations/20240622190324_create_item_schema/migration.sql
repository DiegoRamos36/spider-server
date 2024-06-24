-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "desc" TEXT,
    "preco" REAL NOT NULL,
    "quantidade" INTEGER,
    "adicional" TEXT,
    "slug" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_nome_key" ON "Item"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Item_slug_key" ON "Item"("slug");
