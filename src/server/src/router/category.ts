import { z } from "zod";
import { procedure, router } from "../trpc";
import { Context } from "../context";

export const category = router({
  insert: procedure
    .input(
      z.object({
        category: z.string(),
        createdBy: z.string(),
      })
    )
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: { category: string; createdBy: string };
        ctx: Context;
      }) => {
        try {
          // Prisma transaction for optimized performance
          const newCategory = await ctx.prisma.category.create({
            data: {
              category: input.category,
              createdBy: input.createdBy,
            },
          });
          return newCategory;
        } catch (error) {
          console.error("Error inserting tag:", error);
          throw new Error("Failed to insert tag. Please try again.");
        }
      }
    ),
  getCategoriesByUserId: procedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId } = input;
      const tagsData = await ctx.prisma.category.findMany({
        where: { createdBy: userId },
        select: {
          id: true,
          category: true,
          createdAt: true,
          createdBy: true,
        },
      });

      return tagsData;
    }),
  deleteCategoriesByIdAndUserId: procedure
    .input(
      z.object({
        categoryIds: z.array(z.number()),
        userId: z.string(),
      })
    )
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: { categoryIds: number[]; userId: string };
        ctx: Context;
      }) => {
        try {
          // Prisma transaction to delete multiple categories
          const deletedCategories = await ctx.prisma.category.deleteMany({
            where: {
              id: {
                in: input.categoryIds, // Filter by category IDs
              },
              createdBy: input.userId, // Ensure user ID matches
            },
          });

          return {
            message: `${deletedCategories.count} categories deleted successfully.`,
            deletedCount: deletedCategories.count,
          };
        } catch (error) {
          console.error("Error deleting categories:", error);
          throw new Error("Failed to delete categories. Please try again.");
        }
      }
    ),
});
