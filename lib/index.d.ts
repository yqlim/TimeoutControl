declare class TimeoutControl {
    protected readonly params: any[];
    protected readonly callback: (this: TimeoutControl, callback: (...params: any[]) => void) => void;
    private readonly duration;
    /**
     * `.timeStop` exists solely for the purpose of calculating `.timeLeft`.
     * So every value that it get assigned is for that purpose,
     * though it might look weird in some cases.
     */
    private timeStop;
    private timeStart;
    private id;
    constructor(callback: (...params: any[]) => void, duration: number, ...params: any[]);
    protected readonly timeLeft: number;
    done(): boolean;
    pause(): void;
    resume(): void;
    clear(): void;
    restart(): void;
}
export default TimeoutControl;
