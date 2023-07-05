/*
  Warnings:

  - Added the required column `cla_name` to the `inscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inscriptions" ADD COLUMN     "cla_name" TEXT NOT NULL;
