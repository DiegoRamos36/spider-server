/*
  Warnings:

  - You are about to drop the column `quantidade` on the `Item` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "imgSrc" TEXT NOT NULL DEFAULT '',
    "imgAlt" TEXT NOT NULL DEFAULT '',
    "desc" TEXT,
    "preco" REAL NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Item" ("desc", "id", "imgAlt", "imgSrc", "nome", "preco", "slug") SELECT "desc", "id", "imgAlt", "imgSrc", "nome", "preco", "slug" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_nome_key" ON "Item"("nome");
CREATE UNIQUE INDEX "Item_slug_key" ON "Item"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
