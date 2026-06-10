import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tab";

export default function DashboardShowcase() {
  return (
    <section className="py-28 bg-slate-50">
      <div className="container mx-auto px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold">
            One Platform. Complete Visibility.
          </h2>
        </div>

        <Tabs defaultValue="orders" className="mt-12">

          <TabsList className="grid grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="orders">
              Orders
            </TabsTrigger>

            <TabsTrigger value="pos">
              POS
            </TabsTrigger>

            <TabsTrigger value="analytics">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <img
              src="/orders-dashboard.png"
              alt=""
              className="rounded-2xl mt-8 border"
            />
          </TabsContent>

          <TabsContent value="pos">
            <img
              src="/pos-dashboard.png"
              alt=""
              className="rounded-2xl mt-8 border"
            />
          </TabsContent>

          <TabsContent value="analytics">
            <img
              src="/analytics-dashboard.png"
              alt=""
              className="rounded-2xl mt-8 border"
            />
          </TabsContent>

        </Tabs>
      </div>
    </section>
  );
}