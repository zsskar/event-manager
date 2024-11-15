import { Context } from "../context";
import { procedure, router } from "../trpc";
import { z } from "zod";

export const tags = router({
  insert: procedure
    .input(
      z.object({
        tags: z.string(),
        color: z.string(),
        createdBy: z.string(),
      })
    )
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: { tags: string; color: string; createdBy: string };
        ctx: Context;
      }) => {
        try {
          // Prisma transaction for optimized performance
          const newTag = await ctx.prisma.tag.create({
            data: {
              tags: input.tags,
              color: input.color,
              createdBy: input.createdBy,
            },
          });
          const tagToReturn = {
            ...newTag,
            tags: newTag.tags.split(",").map((t) => t.trim()),
          };
          return tagToReturn;
        } catch (error) {
          console.error("Error inserting tag:", error);
          throw new Error("Failed to insert tag. Please try again.");
        }
      }
    ),
  getTagsByUserId: procedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = input;
      const tagsData = await ctx.prisma.tag.findMany({
        where: { createdBy: userId },
        select: {
          id: true,
          tags: true,
          color: true,
          createdAt: true,
        },
      });

      return tagsData.map((tag) => ({
        ...tag,
        tags: tag.tags.split(",").map((t) => t.trim()), // Convert to array
      }));
    }),
});
