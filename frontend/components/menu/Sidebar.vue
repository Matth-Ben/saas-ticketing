<template>
    <div class="h-lvh p-8 border-r border-dark dark:border-black">
        <div class="Sidebar">
            <div class="Sidebar--top flex flex-col gap-16">
                <div class="flex gap-[0.8rem] items-center">
                    <div class="w-[2.4rem] h-[2.4rem] bg-gray-500 rounded-full"></div>
                    <div>Matthias BENOIT</div>
                </div>
                <div class="Sidebar--menus flex flex-col gap-16">
                    <div class="Sidebar--menu flex flex-col gap-[1.6rem]">
                        <div class="Sidebar--parent text-dark-light">Dashboard</div>
                        <ul class="flex flex-col gap-4 pl-12">
                            <li><a href="#">Overview</a></li>
                            <li><a href="#">Timer</a></li>
                            <li><a href="#">Projects</a></li>
                            <li><a href="#">Calendar</a></li>
                        </ul>
                    </div>

                    <div class="Sidebar--menu flex flex-col gap-[1.6rem]">
                        <div class="Sidebar--parent text-dark-light">Projects</div>
                        <div class="flex flex-col gap-[1.6rem] pl-12">
                            <div class="Sidebar--project flex flex-col">
                                <div class="flex items-center gap-4">Transbordeur<font-awesome icon="caret-up" /></div>
                                <div class="h-full overflow-hidden">
                                    <ul class="flex flex-col gap-4 pl-12 pt-4">
                                        <li><a href="#">Overview</a></li>
                                        <li><a href="#">Tasks</a></li>
                                        <li><a href="#">Timer</a></li>
                                        <li><a href="#">Documents</a></li>
                                        <li><a href="#">Historic</a></li>
                                        <li><a href="#">Settings</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="Sidebar--project flex flex-col">
                                <div class="flex items-center gap-4">Théatre Chaillot<font-awesome icon="caret-down" /></div>
                                <div class="h-0 overflow-hidden">
                                    <ul class="flex flex-col gap-4 pl-12 pt-4">
                                        <li><a href="#">Overview</a></li>
                                        <li><a href="#">Tasks</a></li>
                                        <li><a href="#">Timer</a></li>
                                        <li><a href="#">Documents</a></li>
                                        <li><a href="#">Historic</a></li>
                                        <li><a href="#">Settings</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="Sidebar--project flex flex-col">
                                <div class="flex items-center gap-4">SGH Medical<font-awesome icon="caret-down" /></div>
                                <div class="h-0 overflow-hidden">
                                    <ul class="flex flex-col gap-4 pl-12 pt-4">
                                        <li><a href="#">Overview</a></li>
                                        <li><a href="#">Tasks</a></li>
                                        <li><a href="#">Timer</a></li>
                                        <li><a href="#">Documents</a></li>
                                        <li><a href="#">Historic</a></li>
                                        <li><a href="#">Settings</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>