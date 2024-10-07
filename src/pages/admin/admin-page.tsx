import { FC, useEffect, useState } from 'react'
import { Box, Button, Container, InputAdornment, Paper, styled, TextField, Tooltip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridRowsProp, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase-config';

type Users = {
    id?: string,
    userFname: string,
    userLname: string,
    userEmail: string,
    userRole: string,
}

const AdminPage : FC = () => {

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Users[]>([]);
    
    console.log(filteredData);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    
    // กรองข้อมูลตามข้อความที่พิมพ์
    const handleSearch = (e : React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchText(searchTerm);

        const filtered = filteredData.filter((row) =>
            row.userFname.toLowerCase().includes(searchText.toLowerCase())
        );

        setFilteredData(filtered);
    };

    const columns: GridColDef[] = [
        { 
            field: 'Username', 
            headerName: 'Username', 
            width: 150 
        },
        {   field: 'userFname', 
            headerName: 'Firstname', 
            width: 150 
        },
        {   field: 'userLname', 
            headerName: 'Lastname', 
            width: 150 
        },
        {   field: 'userEmail', 
            headerName: 'Email', 
            width: 270
        },
        {   field: 'userRole', 
            headerName: 'Role', 
            width: 150 
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            getActions: (params) => {
                return [
                <Tooltip key={1} title="แก้ไขข้อมูล">
                    <GridActionsCellItem
                        key={1}
                        icon={<EditIcon color="primary"/>}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                    />
                </Tooltip>,
                <Tooltip key={2} title="ลบข้อมูล">
                    <GridActionsCellItem
                        key={2}
                        icon={<DeleteIcon color="primary"/>}
                        label="Delete"
                        color="inherit"
                    />
                </Tooltip>,
                ];
            },
        },
    ];
    
    
    useEffect(() => {
        const fetchUser = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const docsData = querySnapshot.docs.map(doc => ({ 
                id: doc.id,
                ...doc.data(),
            })) as Users[];
            setFilteredData(docsData);
        }
        fetchUser();
    },[]);

    return (
        
        <Container maxWidth="lg" sx={{mt:15}}>
            <Box sx={{ my : 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='h5'>User Management</Typography>
                    <Button variant="contained" onClick={()=> navigate('create')}>+ เพิ่มผู้ใช้</Button>
                </Box>
                <Paper sx={{ mt : 2, p: 2, boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.2)' }}>
                    <TextField 
                        variant="outlined" 
                        placeholder='Search...'
                        size="small"
                        value={searchText}
                        onChange={handleSearch}
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>
                            } 
                        }}
                    />
                    <Box sx={{height: 500, width : '100%', mt: 2,p: 5}}>
                        <DataGrid 
                            pagination
                            rows={filteredData.map((item, index) => ({ id: index, ...item })) || []}     
                            columns={columns} 
                            pageSizeOptions={[10]}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default AdminPage;