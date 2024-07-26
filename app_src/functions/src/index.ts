import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp(functions.config().firebase);

// Cloud Function that is triggered when a new preference is added to the database
// under the "students" node.
export const onPrefAdd = functions.database
    .ref("/data/students/{uid}/Preferences/{pid}")
    .onCreate(async (snapshot, context) => {
        // Get data for the preference and the user ID from the snapshot and context object, respectively.
        const prefData = snapshot.val();
        const userId = context.params.uid;
        const college = prefData.coll;
        const course = prefData.cour;

        // Initialize the Cloud Firestore database client.
        const db = admin.database();

        // Get the multipliers for the course.
        const coursePath = `data/colleges/${college}/Courses/${course}`;
        const courseSnap = await db.ref(coursePath).get();
        const courseData = courseSnap.val();
        const mData = courseData.Multipliers;
        const subjects = Object.keys(mData);

        const mA = [...subjects.map((k) => ({ [k]: mData[k].adv || 0 }))];
        const mB = [...subjects.map((k) => ({ [k]: mData[k].bas || 0 }))];

        // Get the user's scores.
        const scoresSnap = await db.ref(`data/students/${userId}/Scores`).get();
        const scoresData = scoresSnap.val();

        const sA = [...Object.keys(scoresData).map((k) => ({ [k]: scoresData[k].adv || 0 }))];
        const sB = [...Object.keys(scoresData).map((k) => ({ [k]: scoresData[k].bas || 0 }))];

        // Calculate the user's score for the course using the multipliers and scores.
        const userScore = subjects.reduce((sum, key, i) => {
            const scoreA = sA[i][key] || 0;
            const scoreB = sB[i][key] || 0;
            const multA = mA[i][key] || 0;
            const multB = mB[i][key] || 0;
            return sum + scoreA * multA + scoreB * multB;
        }, 0);

        // Write the calculated score to the database under the "candidates" node for the course.
        return await db.ref(`${coursePath}/candidates/${userId}`).set(userScore);
    });
