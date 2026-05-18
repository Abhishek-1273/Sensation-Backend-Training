import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Framework } from './api/models/framework.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function seedFrameworks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Framework seeding');

    const frameworks = [
      {
        name: 'FDA 21 CFR Part 820',
        shortCode: 'FDA-820',
        description: 'Quality System Regulation (QSR) for medical device manufacturers. Ensures that finished devices will be safe and effective and otherwise in compliance with the Federal Food, Drug, and Cosmetic Act.',
        version: '2024.1',
        authority: 'Food and Drug Administration (FDA)',
        country: 'USA',
        appliesTo: ['company', 'product'],
        industry: 'Medical Devices',
        controls: [
          {
            controlid: '820.20',
            title: 'Management Responsibility',
            description: 'Requirements for management with executive responsibility to establish quality policy and organizational structure.',
            requirementText: 'Management must establish a quality policy, ensure it is understood, and provide adequate resources for quality system activities.',
            mandatory: true,
            riskLevel: 'high',
            tags: ['Governance', 'Management']
          },
          {
            controlid: '820.30',
            title: 'Design Controls',
            description: 'Controls to ensure that specified design requirements are met.',
            requirementText: 'Establish and maintain procedures to control the design of the device in order to ensure that specified design requirements are met.',
            mandatory: true,
            riskLevel: 'high',
            tags: ['Design', 'R&D']
          },
          {
            controlid: '820.70',
            title: 'Production and Process Controls',
            description: 'Requirements for production processes to ensure devices conform to specifications.',
            requirementText: 'Establish and maintain process control procedures that describe any process controls necessary to ensure conformance to specifications.',
            mandatory: true,
            riskLevel: 'medium',
            tags: ['Manufacturing', 'Production']
          }
        ]
      },
      {
        name: 'ISO 13485:2016',
        shortCode: 'ISO-13485',
        description: 'International standard for Medical devices — Quality management systems — Requirements for regulatory purposes.',
        version: '2016',
        authority: 'International Organization for Standardization',
        country: 'International',
        appliesTo: ['company'],
        industry: 'Medical Devices / Pharma',
        controls: [
          {
            controlid: 'ISO-4.1',
            title: 'General QMS Requirements',
            description: 'Establishment of a documented quality management system.',
            requirementText: 'The organization shall document a quality management system and maintain its effectiveness in accordance with the requirements of this International Standard.',
            mandatory: true,
            riskLevel: 'high',
            tags: ['QMS', 'Documentation']
          },
          {
            controlid: 'ISO-7.2',
            title: 'Customer-related processes',
            description: 'Determination of requirements related to product and review of requirements.',
            requirementText: 'The organization shall determine requirements specified by the customer, including requirements for delivery and post-delivery activities.',
            mandatory: true,
            riskLevel: 'medium',
            tags: ['Sales', 'Customer']
          }
        ]
      },
      {
        name: 'FDA 21 CFR Part 211',
        shortCode: 'FDA-211',
        description: 'Current Good Manufacturing Practice (cGMP) for finished pharmaceuticals.',
        version: '2024.1',
        authority: 'Food and Drug Administration (FDA)',
        country: 'USA',
        appliesTo: ['product'],
        industry: 'Pharmaceuticals',
        controls: [
          {
            controlid: '211.22',
            title: 'Responsibilities of Quality Control Unit',
            description: 'Establishment of a quality control unit with authority to approve or reject components and drug products.',
            requirementText: 'There shall be a quality control unit that shall have the responsibility and authority to approve or reject all components, drug product containers, closures, and labeling.',
            mandatory: true,
            riskLevel: 'high',
            tags: ['Quality Control', 'Pharma']
          },
          {
            controlid: '211.160',
            title: 'General Laboratory Requirements',
            description: 'Establishment of scientifically sound laboratory controls.',
            requirementText: 'Establishment of any specifications, standards, sampling plans, or test procedures shall be drafted by the appropriate organizational unit and approved by quality control.',
            mandatory: true,
            riskLevel: 'medium',
            tags: ['Laboratory', 'Testing']
          }
        ]
      },
      {
        name: 'GDPR',
        shortCode: 'GDPR',
        description: 'General Data Protection Regulation — EU regulation on data protection and privacy for individuals within the European Union and European Economic Area.',
        version: '2018',
        authority: 'European Commission',
        country: 'EU',
        appliesTo: ['company'],
        industry: 'All Industries',
        controls: [
          {
            controlid: 'GDPR-5',
            title: 'Principles of Data Processing',
            description: 'Core principles relating to processing of personal data.',
            requirementText: 'Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject.',
            mandatory: true,
            riskLevel: 'high',
            tags: ['Data Protection', 'Privacy']
          },
          {
            controlid: 'GDPR-17',
            title: 'Right to Erasure',
            description: 'The right to be forgotten — data subjects can request deletion of their personal data.',
            requirementText: 'The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay.',
            mandatory: true,
            riskLevel: 'medium',
            tags: ['Privacy', 'Data Rights']
          }
        ]
      },
      {
        name: 'ISO 27001:2022',
        shortCode: 'ISO-27001',
        description: 'International standard for Information security management systems (ISMS).',
        version: '2022',
        authority: 'International Organization for Standardization',
        country: 'International',
        appliesTo: ['company'],
        industry: 'All Industries',
        controls: [
          {
            controlid: '27001-A.5',
            title: 'Information Security Policies',
            description: 'Management direction and support for information security.',
            requirementText: 'A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.',
            mandatory: true,
            riskLevel: 'high',
            tags: ['Security', 'Policy']
          },
          {
            controlid: '27001-A.9',
            title: 'Access Control',
            description: 'Limiting access to information and information processing facilities.',
            requirementText: 'An access control policy shall be established, documented and reviewed based on business and information security requirements.',
            mandatory: true,
            riskLevel: 'high',
            tags: ['Access Control', 'Security']
          }
        ]
      }
    ];

    // Delete existing to avoid duplicates
    await Framework.deleteMany({ shortCode: { $in: frameworks.map(f => f.shortCode) } });

    await Framework.insertMany(frameworks);
    console.log(`✅ Seeded ${frameworks.length} regulatory frameworks successfully.`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedFrameworks();
