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
    "userId" INTEGER NOT NULL
);
INSERT INTO "new_Enderecos" ("address", "bairro", "id", "nome", "numero", "reference", "userId") SELECT "address", "bairro", "id", "nome", "numero", "reference", "userId" FROM "Enderecos";
DROP TABLE "Enderecos";
ALTER TABLE "new_Enderecos" RENAME TO "Enderecos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
