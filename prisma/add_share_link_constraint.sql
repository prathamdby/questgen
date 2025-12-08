ALTER TABLE "ShareLink"
ADD CONSTRAINT share_link_xor_check
CHECK (
  ("paperId" IS NOT NULL AND "solutionId" IS NULL) OR
  ("paperId" IS NULL AND "solutionId" IS NOT NULL)
);
