/** Represents single college and it's courses */
class College {
  private id: string;
  private courses: Map<string, Course>;

  constructor(id: string, courses?: Map<string, Course>) {
    this.id = id;
    this.courses = courses ? courses : new Map<string, Course>();
  }

  addCourse(courseId: string, courseCapacity?: number) {
    if (!courseCapacity || courseCapacity < 0) courseCapacity = 0;
    this.courses.set(courseId, new Course(courseId, courseCapacity));
  }

  getId() {
    return this.id;
  }

  getCourse(course_id: string): Course {
    return this.courses.get(course_id);
  }

  getCourses() {
    return this.courses;
  }

  /**Returns serializable object representing single college */
  serialize() {
    const coursesArr = [];
    this.courses.forEach((c) => {
      coursesArr.push(c.serialize());
    });
    return {
      id: this.id,
      courses: coursesArr,
    };
  }
}

/** Represents college's course, containing it's candidates */
export class Course {
  private id: string;
  capacity: number;
  private candidates: Map<string, number>; // student.id, student.score
  private enrolled: PriorityQueue; // student.id

  constructor(id: string, capacity: number, candidates?: any) {
    this.id = id;
    this.capacity = capacity;
    this.candidates = candidates ? candidates : new Map();
    this.enrolled = new PriorityQueue();
  }

  isFull() {
    return this.enrolled.size() >= this.capacity;
  }

  /** Puts candidate on a waiting list (priority queue).
   * Position is based on  candidate's score. */
  enrollStudent(student_id: string) {
    const score = this.candidates.get(student_id);
    this.enrolled.enqueue(student_id, score);
  }

  /**Removes candidate with the worst score from the list and returns his ID*/
  removeLastEnrolled() {
    return this.enrolled.dequeueLast();
  }

  /**Returns candidate's ID with the worst score from the list (without removing it)*/
  getLastEnrolled(): string {
    return this.enrolled.back();
  }

  /** Takes student ID and returns it's candidate's score */
  getScore(student_id: string): number {
    return this.candidates.get(student_id) || 0;
  }

  /** Returns number of enrolled candidates on a waiting list */
  countEnrolled() {
    return this.enrolled.size() || 0;
  }

  getId() {
    return this.id;
  }

  /**Returns serializable object of this class */
  serialize() {
    const serialized = {
      id: this.id,
      capacity: this.capacity,
      enrolled: this.enrolled.serialize(),
    };
    return serialized;
  }
}

/** Priority Queue for holding course candidates ordered (from the highest score) */
class PriorityQueue {
  private items: { element: string; priority: number }[] = [];

  /** Adds a new element to the queue with the given priority */
  enqueue(element: string, priority: number) {
    let queueElement = { element, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority > this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(queueElement);
    }
  }

  /**Removes and returns the highest priority element from the queue*/
  dequeue() {
    return this.items.shift().element;
  }

  /**Removes and returns the lowest priority element from the queue*/
  dequeueLast() {
    return this.items.pop().element;
  }

  /**Returns the highest priority element from the queue without removing it*/
  front() {
    return this.items[0].element;
  }

  /**Returns the lowest priority element from the queue without removing it*/
  back() {
    return this.items[this.items.length - 1].element;
  }

  /**Returns true if the queue is empty, false otherwise*/
  isEmpty() {
    return this.items.length === 0;
  }

  /**Returns the number of elements in the queue*/
  size() {
    return this.items.length;
  }

  /**Returns the serialized object*/
  serialize() {
    return [...this.items];
  }
}

export default College;
