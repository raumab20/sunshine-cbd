import React from 'react';

import { NextPage } from 'next';
import { ContactForm } from '@/components/ContactForm';

const ContactPage: NextPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-center">Kontakt</h1>
            <ContactForm />
        </div>
    );
};

export default ContactPage;