import { getTablesByEventId, getUnseatedGuests } from "@/lib/actions/tables";
import { TableManager } from "@/components/dashboard/tables/table-manager";
import { connection } from "next/server";

export default async function EventTablesPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await connection(); // Opt-in to dynamic rendering (PPR)
    const { id } = await params;

    const [tables, unseatedGuests] = await Promise.all([
        getTablesByEventId(id),
        getUnseatedGuests(id),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Distribución de Mesas</h2>
                <p className="text-muted-foreground mt-1">
                    Organiza a tus invitados arrastrándolos a los asientos disponibles.
                </p>
            </div>

            <TableManager
                eventId={id}
                initialTables={tables}
                initialUnseatedGuests={unseatedGuests}
            />
        </div>
    );
}
