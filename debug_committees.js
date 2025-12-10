const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function inspectCommittees() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const committees = await mongoose.connection.collection('committees').find({}).toArray();
        const appCommittees = await mongoose.connection.collection('applicationcommittees').find({}).toArray();

        console.log(`\nTerms Definition:`);
        console.log(`- Committee (Template): The Blueprint`);
        console.log(`- ApplicationCommittee (Instance): The assignment to a candidate`);

        console.log(`\n[Templates] in 'committees' collection:`);
        console.log(`Total: ${committees.length}`);
        const activeTemplates = committees.filter(c => c.isActive).length;
        console.log(`Active: ${activeTemplates}`);
        console.log(`Inactive: ${committees.length - activeTemplates}`);

        console.log(`\n[Instances] in 'applicationcommittees' collection:`);
        console.log(`Total: ${appCommittees.length}`);
        const activeInstances = appCommittees.filter(c => c.status === 'active' || !c.status).length; // Assuming 'active' or default
        console.log(`Active: ${activeInstances}`);

        console.log('------------------------------------------------');

        console.log('Committees (Templates) Details:');
        committees.forEach(c => {
            console.log(`ID: ${c._id} | Name: ${c.name} | Active: ${c.isActive} | Type: ${c.type}`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

inspectCommittees();
