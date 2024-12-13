type Audit = {
	createdAt?: string;
	createdBy?: 'FRONTEND' | 'SYSOPS' | 'UNDEFINED';
	updatedAt?: string;
	updatedBy?: 'FRONTEND' | 'SYSOPS' | 'UNDEFINED';
	deletedAt?: string;
	deletedBy?: 'FRONTEND' | 'SYSOPS' | 'UNDEFINED';
}
type Item = {
    id: string;
    name: string;
    description: string;
    quantity: string;
    note: string;
    category_name: string;
    category_id: string;
    store_name: string;
    store_id: string;
    audit: Audit;
}
