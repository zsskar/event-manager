import { ContentLayout } from "@/components/layout/ContentLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddTags from "./AddTags";
import ViewTags from "./ViewTags";

export default function Tags() {
  return (
    <ContentLayout title="Event Tags">
      <Tabs defaultValue="view">
        <TabsList className="grid-cols-2">
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="add">Add</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <ViewTags />
        </TabsContent>
        <TabsContent value="add">
          <AddTags />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
