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
                link: '/pinjamansetuju',
                logo:'pinjamanDiterima.svg',
            },
            {
                permission: 'lender_loan_request_list',
                label: 'Tidak Disetujui',
                link: '/pinjamanrejected',
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
        logo:'nasabah.svg',
        child: [
            {
                permission: 'lender_product_list',
                label: 'Produk',
                link: '/produk',
                logo:'nasabahList.svg',
            },
            {
                permission: 'lender_service_list',
                label: 'Layanan',
                link: '/layanan',
                logo:'calonNasabah.svg',
            }
        ]
    },
    {
        permission:'keluar',
        label: 'Keluar',
        logo:'keluar.svg',
    },
]