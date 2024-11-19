import { z } from "zod";
import { procedure, router } from "../trpc";
import { Context } from "../context";

export const calender = router({
  createEvent: procedure
    .input(
      z.object({
        name: z.string().min(1, "Event name is required"),
        createdBy: z.string().min(1, "Creator information is required"),
        location: z.string().min(1, "Location is required"),
        fromDate: z.string(),
        toDate: z.string(),
        description: z.string().optional(),
        tags: z.string().min(1, "At least one tag is required"),
        category: z.string().min(1, "Category is required"),
      })
    )
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: {
          name: string;
          createdBy: string;
          location: string;
          fromDate: string;
          toDate: string;
          description?: string;
          tags: string;
          category: string;
        };
        ctx: Context;
      }) => {
        try {
          const event = await ctx.prisma.event.create({
            data: {
              name: input.name,
              createdBy: input.createdBy,
              location: input.location,
              fromDate: new Date(input.fromDate),
              toDate: new Date(input.toDate),
              description: input.description || null,
              tags: input.tags,
              category: input.category,
            },
          });
          return { success: true, event };
        } catch (error) {
          console.error("Error creating event:", error);
          throw new Error("Failed to create event. Please try again later.");
        }
      }
    ),

  deleteEventById: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.event.delete({
          where: { id: input.id },
        });
        return { success: true, message: "Event deleted successfully" };
      } catch (error) {
        console.error("Error deleting event:", error);
        throw new Error("Failed to delete event. Please try again later.");
      }
    }),

  updateEventById: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        location: z.string().min(1).optional(),
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
        description: z.string().optional(),
        tags: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: {
          id: number;
          name?: string;
          location?: string;
          fromDate?: Date;
          toDate?: Date;
          description?: string;
          tags?: string;
          category?: string;
        };
        ctx: Context;
      }) => {
        try {
          const updatedEvent = await ctx.prisma.event.update({
            where: { id: input.id },
            data: {
              ...(input.name && { name: input.name }),
              ...(input.location && { location: input.location }),
              ...(input.fromDate && { fromDate: input.fromDate }),
              ...(input.toDate && { toDate: input.toDate }),
              ...(input.description && { description: input.description }),
              ...(input.tags && { tags: input.tags }),
              ...(input.category && { category: input.category }),
            },
          });
          return { success: true, event: updatedEvent };
        } catch (error) {
          console.error("Error updating event:", error);
          throw new Error("Failed to update event. Please try again later.");
        }
      }
    ),
  getAllEventsByUserId: procedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const events = await ctx.prisma.event.findMany({
          where: { createdBy: input.userId },
        });
        return { success: true, events: events };
      } catch (error) {
        console.error("Error fetching events:", error);
        throw new Error("Failed to fetch events. Please try again later.");
      }
    }),
});
