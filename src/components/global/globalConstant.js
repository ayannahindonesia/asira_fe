exports.dataMenu = [
    {
        permission:'lender_borrower_list',
        label: 'Nasabah',
        logo:'nasabah.svg',
        child: [
            {
                permission: 'lender_borrower_list',
                label: 'Nasabah List',
                link: '/profileNasabah',
                logo:'nasabahList.svg',
            },
            {
                permission: 'lender_borrower_list',
                label: 'Calon Nasabah List',
                link: '/listCalonNasabah',
                logo:'calonNasabah.svg',
            }
        ]
    },
    {
        permission:'lender_loan_request_list',
        label: 'Pinjaman',
        logo:'pinjaman.svg',
        child: [
            {
                permission: 'lender_loan_request_list',
                label: 'Pinjaman List',
                link: '/permintaanpinjaman',
                logo:'pinjamanList.svg',
            },
            {
                permission: 'lender_loan_request_list',
                label: 'Disetujui',
                link: '/pinjamanSetuju',
                logo:'pinjamanDiterima.svg',
            },
            {
                permission: 'lender_loan_request_list',
                label: 'Tidak Disetujui',
                link: '/pinjamanTolak',
                logo:'pinjamanDitolak.svg',
            }
        ]
    },
    {
        permission:'lender_loan_request_list',
        label: 'Pencairan',
        logo:'pencairan.svg',
        child: [
            {
                permission: 'lender_borrower_list',
                label: 'Pinjaman Telah Dicairkan',
                link: '/pencairanList',
                logo:'checklist.svg',
            },
        ]
    },
    {
        permission:'lender_borrower_list',
        label: 'Produk & Layanan',
        logo:'productService.svg',
        child: [
            {
                permission: 'lender_product_list',
                label: 'Produk',
                link: '/produk',
                logo:'product.svg',
            },
            {
                permission: 'lender_service_list',
                label: 'Layanan',
                link: '/layanan',
                logo:'service.svg',
            }
        ]
    },
    {
        permission:'keluar',
        label: 'Keluar',
        logo:'keluar.svg',
    },
]