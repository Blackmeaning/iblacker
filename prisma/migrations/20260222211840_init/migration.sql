-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
