exports.dataMenu = [
    {
        permission:'lender_borrower_list',
        label: 'Nasabah',
        logo:'Nasabah.svg',
        child: [
            {
                permission: 'lender_borrower_list',
                label: 'Nasabah List',
                link: '/profileNasabah',
                logo:'NasabahList.svg',
            },
            {
                permission: 'lender_borrower_list',
                label: 'Calon Nasabah List',
                link: '/listCalonNasabah',
                logo:'NasabahCalon.svg',
            }
        ]
    },
    {
        permission:'lender_loan_request_list',
        label: 'Pinjaman',
        logo:'Pinjaman.svg',
        child: [
            {
                permission: 'lender_loan_request_list',
                label: 'Permintaan Pinjaman',
                link: '/permintaanPinjaman',
                logo:'PinjamanList.svg',
            },
            {
                permission: 'lender_loan_request_list',
                label: 'Disetujui',
                link: '/pinjamanSetuju',
                logo:'PinjamanDiterima.svg',
            },
            {
                permission: 'lender_loan_request_list',
                label: 'Tidak Disetujui',
                link: '/pinjamanTolak',
                logo:'PinjamanDitolak.svg',
            },
            {
                permission: 'lender_loan_request_list',
                label: 'Pinjaman Telah Dicairkan',
                link: '/pencairanList',
                logo:'Pencairan.svg',
            },
        ]
    },
    // {
    //     permission:'lender_loan_request_list',
    //     label: 'Pencairan',
    //     logo:'pencairan.svg',
    //     child: [
    //         {
    //             permission: 'lender_borrower_list',
    //             label: 'Pinjaman Telah Dicairkan',
    //             link: '/pencairanList',
    //             logo:'checklist.svg',
    //         },
    //     ]
    // },
    {
        permission:'lender_product_list lender_service_list',
        label: 'Produk & Layanan',
        logo:'ProdukService.svg',
        child: [
            {
                permission: 'lender_product_list',
                label: 'Produk',
                link: '/produk',
                logo:'Produk.svg',
            },
            {
                permission: 'lender_service_list',
                label: 'Layanan',
                link: '/layanan',
                logo:'Service.svg',
            }
        ]
    },
    {
        permission:'keluar',
        label: 'Keluar',
        logo:'Keluar.svg',
    },
]