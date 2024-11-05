-- CreateEnum
CREATE TYPE "ProjectStatusProgress" AS ENUM ('ASSIGNED', 'IN_REVIEW', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "ProjectStatusVisibility" AS ENUM ('DRAFT', 'UNPUBLIHSED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AssetStatusReview" AS ENUM ('APPROVED', 'REJECT', 'IN_REVIEW');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Project" (
    "project_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status_progress" "ProjectStatusProgress" NOT NULL DEFAULT 'ASSIGNED',
    "status_visibility" "ProjectStatusVisibility" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "ProjectDeadline" (
    "project_id" INTEGER NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDeadline_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "ProjectAssignee" (
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "ProjectAssignee_pkey" PRIMARY KEY ("project_id","user_id")
);

-- CreateTable
CREATE TABLE "ProjectBrief" (
    "project_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ProjectBrief_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "ProjectAsset" (
    "asset_id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "asset_name" TEXT NOT NULL,
    "asset_url" TEXT NOT NULL,
    "asset_status_review" "AssetStatusReview" NOT NULL DEFAULT 'IN_REVIEW',

    CONSTRAINT "ProjectAsset_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "ProjectAssetMarket" (
    "asset_id" INTEGER NOT NULL,
    "market_name" TEXT NOT NULL,

    CONSTRAINT "ProjectAssetMarket_pkey" PRIMARY KEY ("asset_id","market_name")
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "milestone_id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "is_done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("milestone_id")
);

-- CreateTable
CREATE TABLE "MilestoneComment" (
    "comment_id" SERIAL NOT NULL,
    "milestone_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MilestoneComment_pkey" PRIMARY KEY ("comment_id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDeadline" ADD CONSTRAINT "ProjectDeadline_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignee" ADD CONSTRAINT "ProjectAssignee_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignee" ADD CONSTRAINT "ProjectAssignee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBrief" ADD CONSTRAINT "ProjectBrief_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAsset" ADD CONSTRAINT "ProjectAsset_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssetMarket" ADD CONSTRAINT "ProjectAssetMarket_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "ProjectAsset"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone" ADD CONSTRAINT "ProjectMilestone_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneComment" ADD CONSTRAINT "MilestoneComment_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "ProjectMilestone"("milestone_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneComment" ADD CONSTRAINT "MilestoneComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
