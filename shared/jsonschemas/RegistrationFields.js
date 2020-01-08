const Genders = require('../constants/genders')
const Countries = require('../constants/countries')
const Languages = require('../constants/languages')
const Industries = require('../constants/industries')
const Themes = require('../constants/themes')
// Fastify.addSchema breaks due to items containing '#' such as 'C#', TODO: find solution
// https://github.com/fastify/fastify/issues/2021
// const Roles = require('../constants/roles')
// const Skills = require('../constants/skills')
const Misc = require('../constants/misc')

module.exports = Object.freeze({
    firstName: {
        title: 'First name',
        description: 'First name',
        type: 'string',
        minLength: 1,
        maxLength: 100,
        errorMessage: 'must be between 1 and 100 characters',
    },
    lastName: {
        description: 'Last name',
        type: 'string',
        minLength: 1,
        maxLength: 100,
        errorMessage: 'must be between 1 and 100 characters',
    },
    email: {
        description: 'Email address',
        type: 'string',
        format: 'email',
        errorMessage: 'must be a valid email address',
    },
    phoneNumber: {
        description: 'Phone number',
        type: 'object',
        properties: {
            country_code: {
                description: 'Country code',
                type: 'string',
                enum: Countries.asArrayOfPhoneCodes,
                errorMessage: 'must be a valid country code',
            },
            number: {
                description: 'Number',
                type: 'string',
                pattern: '^[0-9]{7,14}$',
                errorMessage:
                    'must be a valid phone number (7-14 characters), without the leading country code',
            },
        },
        required: ['country_code', 'number'],
    },
    dateOfBirth: {
        description: 'Date of birth',
        type: 'string',
        format: 'date-time',
        errorMessage: 'must be a valid date',
    },
    gender: {
        description: 'Gender',
        type: 'string',
        enum: Genders,
        errorMessage: `must be one of ${Genders.join(', ')}`,
    },
    nationality: {
        description: 'Nationality',
        type: 'string',
        enum: Countries.asArrayOfNationalities,
        errorMessage: 'must be a valid nationality',
    },
    spokenLanguages: {
        description: 'Spoken languages',
        type: 'array',
        items: {
            description: 'Language',
            type: 'string',
            enum: Languages.asArrayOfNames,
            errorMessage: 'must be a valid language',
        },
    },
    countryOfResidence: {
        description: 'Country of residence',
        type: 'string',
        enum: Countries.asArrayOfName,
        errorMessage: 'must be a valid country',
    },
    cityOfResidence: {
        description: 'City of residence',
        type: 'string',
        minLength: 1,
        maxLength: 200,
        errorMessage: 'must be between 1 and 200 characters',
    },
    tShirtSize: {
        description: 'T-shirt size',
        type: 'string',
        enum: Misc.tShirtSizes,
        errorMessage: `must be one of ${Misc.tShirtSizes.join(',')}`,
    },
    dietaryRestrictions: {
        description: 'Dietary restrictions',
        type: 'array',
        items: {
            description: 'Dietary restriction',
            type: 'string',
            enum: Misc.dietaryRestrictions,
        },
    },
    headline: {
        description: 'Headline',
        type: 'string',
        minLength: 1,
        maxLength: 100,
    },
    biography: {
        description: 'Biography',
        type: 'string',
        minLength: 1,
        maxLength: 1000,
    },
    roles: {
        description: 'Professional roles',
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
            description: 'Professional role',
            type: 'object',
            properties: {
                role: {
                    description: 'Role',
                    type: 'string',
                },
                years: {
                    description: 'Years of experience',
                    type: 'integer',
                    minimum: 1,
                    maximum: 5,
                },
            },
            required: ['role', 'years'],
        },
    },
    skills: {
        description: 'Skills',
        type: 'array',
        minItems: 1,
        maxItems: 10,
        items: {
            description: 'Skill',
            type: 'object',
            properties: {
                skill: {
                    description: 'Skill',
                    type: 'string',
                },
                level: {
                    description: 'Level of experience',
                    type: 'number',
                    minimum: 1,
                    maximum: 5,
                },
            },
            required: ['skill', 'level'],
        },
    },
    motivation: {
        description: 'Letter of motivation',
        type: 'string',
        minLength: 1,
        maxLength: 2000,
    },
    industriesOfInterest: {
        description: 'Industries of interest',
        type: 'array',
        minItems: 1,
        maxItems: 3,
        items: {
            description: 'Industry',
            type: 'string',
            enum: Industries.industries,
        },
    },
    themesOfInterest: {
        description: 'Themes of interest',
        type: 'array',
        minItems: 1,
        maxItems: 3,
        items: {
            description: 'Theme',
            type: 'string',
            enum: Themes.themes,
        },
    },
    numHackathons: {
        description: 'Number of hackathons attended',
        type: 'number',
        minimum: 0,
        maximum: 5,
    },
    education: {
        description: 'Most recent education',
        type: 'object',
        properties: {
            level: {
                description: 'Level of education',
                type: 'string',
            },
            university: {
                description: 'University/School',
                type: 'string',
            },
            degree: {
                description: 'Degree/Major',
                type: 'string',
            },
            graduationYear: {
                description: 'Graduation year',
                type: 'number',
                minimum: 1900,
                maximum: 2100,
            },
        },
        required: ['level'],
    },
    portfolio: {
        description: 'Link to portfolio',
        type: 'string',
        format: 'uri',
    },
    github: {
        description: 'Link to GitHub (or similar)',
        type: 'string',
        format: 'uri',
    },
    linkedin: {
        description: 'Link to LinkedIn (or similar)',
        type: 'string',
        format: 'uri',
    },
    countryOfTravel: {
        description: 'Country of travel',
        type: 'string',
        enum: Countries.asArrayOfName,
    },
    cityOfTravel: {
        description: 'City of travel',
        type: 'string',
        minLength: 1,
        maxLength: 100,
    },
    needsVisa: {
        description: 'Do you need a visa?',
        type: 'boolean',
        default: false,
    },
    needsTravelGrant: {
        description: 'Do you want to apply for a travel grant?',
        type: 'boolean',
        default: false,
    },
    needsAccommodation: {
        description: 'Do you want to apply for free accommodation?',
        type: 'boolean',
        default: false,
    },
    teamOptions: {
        description: 'Team preferences',
        type: 'object',
        properties: {
            applyAsTeam: {
                description: 'Applying as a team?',
                type: 'boolean',
                default: false,
            },
            applyAlone: {
                description: 'Applying also alone?',
                type: 'boolean',
                default: false,
            },
        },
        required: ['applyAsTeam', 'applyAlone'],
    },
    secretCode: {
        description: 'Secret code',
        type: 'string',
        minLength: 1,
        maxLength: 200,
    },
    recruitmentOptions: {
        description: 'Job opportunities',
        type: 'object',
        properties: {
            status: {
                description: 'Interested in recruitment?',
                type: 'string',
                enum: Object.keys(Misc.recruitmentStatuses),
            },
            consent: {
                description: 'Consent to data-sharing',
                type: 'boolean',
                default: false,
            },
            relocation: {
                description: 'Willingness to relocate',
                type: 'string',
                enum: Object.keys(Misc.relocationOptions),
            },
        },
    },
})
