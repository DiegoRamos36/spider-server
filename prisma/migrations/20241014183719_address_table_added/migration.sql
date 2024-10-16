-- CreateTable
CREATE TABLE "Enderecos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" INTEGER NOT NULL
);
