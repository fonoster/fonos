import PageContainer from '@/common/components/page-with-table';
import { Button } from '@mui/material';
import { Credentials } from '@fonoster/types';
import { ColumnDef } from "@tanstack/react-table";


const columns: ColumnDef<Credentials>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: (info: any) => info.getValue(),
  }
];

export default function CredentialsPage() {
  return (
    <PageContainer>
      <PageContainer.Header
        title="Credentials"
        actions={
          <Button variant="contained" onClick={() => { }}>
            Create New Credential
          </Button>
        }
      />
      <PageContainer.Subheader>
        Manage authentication credentials for your SIP network.
      </PageContainer.Subheader>

      <PageContainer.ContentTable<Credentials> columns={columns} tableId="acl-table" />
    </PageContainer>
  );
} 