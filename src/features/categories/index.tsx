import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentLayout } from "@/components/layout/ContentLayout";
import AddCategory from "./AddCategory";
import { ViewCategories } from "./ViewCategories";

export default function Categories() {
  return (
    <ContentLayout title="Event Categories">
      <Tabs defaultValue="view">
        <TabsList className="grid-cols-2">
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="add">Add</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <ViewCategories />
        </TabsContent>
        <TabsContent value="add">
          <AddCategory />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
