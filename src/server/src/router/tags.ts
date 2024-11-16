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
  deleteTagsByUserId: procedure
    .input(
      z.object({
        userId: z.string(), // User ID to match
        tags: z.string(), // Comma-separated string of tags to delete
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, tags } = input; // tags is a comma-separated string or an array
      const tagsArray = tags.split(",").map((tag) => tag.trim()); // Convert tags to an array

      // Find all records where the createdBy matches userId
      const tagRecords = await ctx.prisma.tag.findMany({
        where: {
          createdBy: userId,
        },
      });

      if (tagRecords.length === 0) {
        throw new Error("No tags found for the given user.");
      }

      // Loop through each record and filter out the tags to delete
      for (const tagRecord of tagRecords) {
        // Split the tags from the record and check if any of the tags match the ones to delete
        const currentTags = tagRecord.tags.split(",").map((tag) => tag.trim());

        // Filter out the tags that need to be deleted
        const remainingTags = currentTags.filter(
          (tag) => !tagsArray.includes(tag)
        );

        if (remainingTags.length === 0) {
          // If no tags remain, delete the record
          await ctx.prisma.tag.delete({
            where: {
              id: tagRecord.id,
            },
          });
        } else {
          // Otherwise, update the record with the remaining tags
          await ctx.prisma.tag.update({
            where: {
              id: tagRecord.id,
            },
            data: {
              tags: remainingTags.join(","),
            },
          });
        }
      }

      return { success: true };
    }),
});
