package app

import (
	"context"
	"database/sql"
	"log"
	"sync"

	"github.com/christer79/shopper/backend/internal/app/auth"
)

type Resolver struct {
	DB        *sql.DB
	SQL_mutex *sync.Mutex
}

func (r *Resolver) DeleteListsDB(name string) {
	log.Printf("DeleteListsDB %+v\n", name)
	sqstm, err := r.DB.Prepare("DROP TABLE " + name + "_items;")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
	sqstm, err = r.DB.Prepare("DROP TABLE " + name + "_sections;")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}

}

func (r *Resolver) CreateNewListDB(name string) {
	log.Printf("CreateNewListDB, %+v\n", name)
	sqstm, err := r.DB.Prepare("CREATE TABLE " + name + "_items(id SERIAL PRIMARY KEY, item_id VARCHAR(50) UNIQUE NOT NULL, name VARCHAR (50) NOT NULL, amount FLOAT8 NOT NULL, unit VARCHAR (50) NOT NULL, section VARCHAR (50) NOT NULL,  checked BOOL NOT NULL,  deleted BOOL NOT NULL,  position INT NOT NULL, goal FLOAT8 NOT NULL);")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
	sqstm, err = r.DB.Prepare("CREATE TABLE " + name + "_sections(id SERIAL PRIMARY KEY, section_id VARCHAR(50) UNIQUE NOT NULL, name VARCHAR(50) NOT NULL, position INTEGER NOT NULL);")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
	sqstm, err = r.DB.Prepare("INSERT INTO " + name + "_sections(section_id, name, position) VALUES('section-0', 'Unsorted', 0);")
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
}

func (r *Resolver) CreateNewSuggestionTable(user string, listType string) {
	query := "CREATE TABLE _" + user + "_" + listType + "_suggestions(id SERIAL PRIMARY KEY, item_name VARCHAR(50) UNIQUE NOT NULL, section_name VARCHAR (50) NOT NULL, unit VARCHAR(50) NOT NULL);"
	log.Printf("CreateNewSuggestionTable: %s\n", query)
	sqstm, err := r.DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Printf("Ignoring: %v\n", err)
	}
}

func (r Resolver) GetListType(list_id string) string {
	query := "SELECT list_type FROM lists WHERE list_id='" + list_id + "';"
	log.Printf("GetListType, %+v\n", query)
	rows, err := r.DB.Query(query)
	if err != nil {
		log.Printf("Error %v for query: %v\n", err, query)
		return "shopping"
	}
	var listType string
	for rows.Next() {
		err := rows.Scan(&listType)
		if err != nil {
			log.Fatal(err)
		}
	}
	return listType
}

func (r *Resolver) GetSectionName(table, section_id string) string {
	query := "SELECT name FROM " + table + "_sections WHERE section_id = '" + section_id + "';"
	log.Printf("GetSectionName, %+v\n", query)

	rows, err := r.DB.Query(query)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
	}
	var section_name string
	for rows.Next() {
		err := rows.Scan(&section_name)
		if err != nil {
			log.Fatal(err)
		}

	}
	return section_name
}
func (r *Resolver) AddSuggestion(_user, _item_name, _section_id, _unit, _table *string) {
	// CHECK IF IT EXISTS
	log.Printf("Add suggestion\n")
	user := *_user
	item_name := *_item_name
	section_id := *_section_id
	unit := *_unit
	table := *_table

	section_name := r.GetSectionName(table, section_id)

	listType := r.GetListType(table)

	log.Printf("Derived list type %v from list_id %v", listType, table)
	suggestion_list := user + "_" + listType

	query := "SELECT item_name FROM _" + suggestion_list + "_suggestions WHERE item_name = '" + item_name + "';"
	log.Printf("AddSuggestion Query: %s\n", query)
	r.SQL_mutex.Lock()
	rows, err := r.DB.Query(query)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
	}
	suggestion_exists := false
	for rows.Next() {
		log.Printf("Suggestion for %s exists", item_name)
		suggestion_exists = true
	}
	if suggestion_exists {
		query := "UPDATE _" + suggestion_list + "_suggestions SET(section_name, unit) = ($1, $2) WHERE item_name = '" + item_name + "';"
		log.Printf("AddSuggestion Query: %s\n", query)
		sqstm, err := r.DB.Prepare(query)
		if err != nil {
			log.Fatal(err)
		}
		_, err = sqstm.Exec(section_name, unit)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		query := "INSERT INTO _" + suggestion_list + "_suggestions(item_name, section_name, unit) VALUES($1,$2,$3);"
		log.Printf("AddSuggestion Query: %s\n", query)
		sqstm, err := r.DB.Prepare(query)
		if err != nil {
			log.Fatal(err)
		}
		_, err = sqstm.Exec(item_name, section_name, unit)
		if err != nil {
			log.Fatal(err)
		}
	}
	r.SQL_mutex.Unlock()
}

func (r Resolver) AccessAllowed(uid, table string) (bool, error) {
	query := "SELECT id, list_id, list_name , owner FROM lists WHERE user_uid = '" + uid + "' AND list_id = '" + table + "';"
	log.Printf("AccessAllowed, %+v\n", query)

	rows, err := r.DB.Query(query)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
	}
	var lists []*List
	for rows.Next() {
		var list List
		var id int
		err := rows.Scan(&id, &list.ID, &list.Name, &list.Owner)
		if err != nil {
			log.Fatal(err)
		}
		lists = append(lists, &list)
	}
	if len(lists) != 1 {
		log.Fatalf("Should match exactly one (1) row in lists got: %v\n", lists)
	}
	return len(lists) == 1, nil
}

func (r *Resolver) Mutation() MutationResolver {
	return &mutationResolver{r}
}
func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}
func (r *Resolver) Subscription() SubscriptionResolver {
	return &subscriptionResolver{r}
}

type mutationResolver struct{ *Resolver }

func (r *mutationResolver) CreateList(ctx context.Context, input *NewList) (*List, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	r.CreateNewSuggestionTable(user.UID, input.Listtype)
	var listOwner = true
	query := "INSERT INTO lists(list_id,list_name, list_type, user_uid, owner) VALUES($1,$2,$3,$4,$5) RETURNING id"
	log.Printf("CreateList query: %+v\n", query)
	sqstm, err := r.DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec(input.ID, input.Name, input.Listtype, user.UID, listOwner)
	if err != nil {
		log.Fatal(err)
	}
	r.CreateNewListDB(input.ID)

	return &List{Name: input.Name, ID: input.ID, Sections: []*Section{}, Items: []*Item{}}, nil
}

func (r *mutationResolver) DeleteList(ctx context.Context, id string) (*List, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	var listOwner = true
	query := "DELETE FROM lists WHERE list_id = $1 AND user_uid = $2"
	log.Printf("DeleteList %+v, %+v\n", id, query)

	sqstm, err := r.DB.Prepare(query)

	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec(id, user.UID)
	if err != nil {
		log.Fatal(err)
	}

	// TODO: Verify owner of list before deleting tables, only dete table if all references in tn lists are gone.
	r.DeleteListsDB(id)

	return &List{Name: "", ID: id, Owner: listOwner, Sections: []*Section{}, Items: []*Item{}}, nil
}
func (r *mutationResolver) CreateItem(ctx context.Context, input *NewItem) (*Item, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}

	access, _ := r.AccessAllowed(user.UID, input.Table)
	if !access {
		log.Fatalf("Acess to table %s is not allowed for user %s", input.Table, user.UID)
	}
	query := "INSERT INTO " + input.Table + "_items(item_id, name, amount, unit, section, checked, deleted, position, goal) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id"
	log.Printf("CreateItem, %+v\n", query)

	sqstm, err := r.DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("input: %v, Position %v", input, input.Position)
	_, err = sqstm.Exec(input.ID, input.Name, input.Amount, input.Unit, input.Section, input.Checked, input.Deleted, input.Position, input.Goal)
	if err != nil {
		log.Fatal(err)
	}
	r.AddSuggestion(&user.UID, &input.Name, input.Section, input.Unit, &input.Table)
	return &Item{ID: input.ID}, nil
}
func (r *mutationResolver) UpdateItem(ctx context.Context, input NewItem) (*Item, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	access, _ := r.AccessAllowed(user.UID, input.Table)
	if !access {
		log.Fatalf("Acess to table %s is not allowed for user %s", input.Table, user.UID)
	}
	query := "UPDATE  " + input.Table + "_items SET( name, amount, unit, section, checked, deleted, position, goal) = ($1, $2,$3,$4,$5,$6,$7,$8) WHERE item_id = '" + input.ID + "';"
	log.Printf("UpdateItem, %+v\n", query)

	sqstm, err := r.DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec(input.Name, input.Amount, input.Unit, input.Section, input.Checked, input.Deleted, input.Position, input.Goal)
	if err != nil {
		log.Fatal(err)
	}
	r.AddSuggestion(&user.UID, &input.Name, input.Section, input.Unit, &input.Table)

	return &Item{ID: input.ID}, nil
}
func (r *mutationResolver) DeleteItem(ctx context.Context, input DeleteItem) (*Item, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	access, _ := r.AccessAllowed(user.UID, input.Table)
	if !access {
		log.Fatalf("Acess to table %s is not allowed for user %s", input.Table, user.UID)
	}
	query := "DELETE FROM " + input.Table + "_items WHERE item_id = '" + input.ID + "';"
	log.Printf("DeleteItem, %+v\n", query)

	sqstm, err := r.DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
	return &Item{ID: input.ID}, nil

}
func (r *mutationResolver) CreateSection(ctx context.Context, input *NewSection) (*Section, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	access, _ := r.AccessAllowed(user.UID, input.Table)
	if !access {
		log.Fatalf("Acess to table %s is not allowed for user %s", input.Table, user.UID)
	}

	query := "INSERT INTO " + input.Table + "_sections(section_id, name, position) VALUES($1,$2,$3) RETURNING id"
	log.Printf("CreateSection, %+v\n", query)

	sqstm, err := r.DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("input: %v, Position %v", input, input.Position)
	_, err = sqstm.Exec(input.ID, input.Name, input.Position)
	if err != nil {
		log.Fatal(err)
	}
	return &Section{ID: input.ID}, nil
}
func (r *mutationResolver) UpdateSection(ctx context.Context, input *NewSection) (*Section, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	access, _ := r.AccessAllowed(user.UID, input.Table)
	if !access {
		log.Fatalf("Acess to table %s is not allowed for user %s", input.Table, user.UID)
	}
	query := "UPDATE  " + input.Table + "_sections SET( name, position) = ($1, $2) WHERE section_id = '" + input.ID + "';"
	log.Printf("UpdateSection, %+v\n", query)

	sqstm, err := r.DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec(input.Name, input.Position)
	if err != nil {
		log.Fatal(err)
	}
	return &Section{ID: input.ID}, nil
}
func (r *mutationResolver) DeleteSection(ctx context.Context, input DeleteSection) (*Section, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	access, _ := r.AccessAllowed(user.UID, input.Table)
	if !access {
		log.Fatalf("Acess to table %s is not allowed for user %s", input.Table, user.UID)
	}
	query := "DELETE FROM " + input.Table + "_sections WHERE section_id = '" + input.ID + "';"
	log.Printf("DeleteSection, %+v\n", query)

	sqstm, err := r.DB.Prepare(query)
	if err != nil {
		log.Fatal(err)
	}
	_, err = sqstm.Exec()
	if err != nil {
		log.Fatal(err)
	}
	return &Section{ID: input.ID}, nil

}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Lists(ctx context.Context) ([]*List, error) {
	query := "CREATE TABLE lists(id SERIAL PRIMARY KEY, list_id VARCHAR(50) NOT NULL, list_name VARCHAR(50) NOT NULL, list_typ VARCHAR(50), user_uid VARCHAR(50), owner BOOLEAN);"
	log.Printf("Lists, %+v\n", query)
	r.DB.Query(query)

	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	query = "SELECT id, list_id, list_name, list_type, owner FROM lists WHERE user_uid = '" + user.UID + "';"
	log.Printf("Lists, %+v\n", query)
	rows, err := r.DB.Query(query)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
	}
	var ret []*List
	for rows.Next() {
		var i List
		var id int
		err := rows.Scan(&id, &i.ID, &i.Name, &i.Listtype, &i.Owner)
		if err != nil {
			log.Fatal(err)
		}
		ret = append(ret, &i)
	}
	return ret, nil
}
func (r *queryResolver) List(ctx context.Context, id string) (*List, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}
	query := "SELECT id, list_id, list_name , list_type, owner FROM lists WHERE user_uid = '" + user.UID + "' AND list_id = '" + id + "';"
	log.Printf("List, %+v\n", query)

	rows, err := r.DB.Query(query)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
	}
	var lists []*List
	for rows.Next() {
		var list List
		var id int
		err := rows.Scan(&id, &list.ID, &list.Name, &list.Listtype, &list.Owner)
		if err != nil {
			log.Fatal(err)
		}
		lists = append(lists, &list)
	}
	if len(lists) != 1 {
		log.Fatalf("Should match exactly one (1) row in lists got: %v\n", lists)
	}

	// GET SECTION
	query = "SELECT * FROM " + id + "_sections;"
	log.Printf("Get Section query: %v\n", query)
	rows, err = r.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var sections []*Section
	for rows.Next() {
		section := new(Section)
		var id int
		err := rows.Scan(&id, &section.ID, &section.Name, &section.Position)
		if err != nil {
			log.Fatal(err)
		}
		sections = append(sections, section)
	}

	// GET ITEMS
	query = "SELECT * FROM " + id + "_items;"
	log.Printf("Get Items query: %v\n", query)
	rows, err = r.DB.Query(query)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
	}

	var items []*Item
	for rows.Next() {
		item := new(Item)
		var id int
		// id | item_id | name | amount | goal | unit | section | checked | deleted | position
		err = rows.Scan(&id, &item.ID, &item.Name, &item.Amount, &item.Unit, &item.Section, &item.Checked, &item.Deleted, &item.Position, &item.Goal)
		if err != nil {
			log.Fatal(err)
		}

		items = append(items, item)
	}
	//	log.Printf("Name: %s, ID. %s , Sections: %v, Items: %v", lists[0].Name, id, sections, items)
	return &List{Name: lists[0].Name, ID: id, Sections: sections, Items: items}, nil

}
func (r *queryResolver) Suggestions(ctx context.Context, list string) ([]*Suggestion, error) {
	user, ok := auth.FromContext(ctx)
	if !ok {
		log.Fatalf("No user in context\n")
	}

	listType := r.GetListType(list)
	query := "SELECT * FROM _" + user.UID + "_" + listType + "_suggestions;"
	log.Printf("Suggestions, %+v\n", query)

	rows, err := r.DB.Query(query)
	defer rows.Close()
	if err != nil {
		log.Fatal(err)
	}
	var suggestions []*Suggestion
	for rows.Next() {
		suggestion := new(Suggestion)
		var id int
		err := rows.Scan(&id, &suggestion.Name, &suggestion.Section, &suggestion.Unit)

		if err != nil {
			log.Fatal(err)
		}

		suggestions = append(suggestions, suggestion)
	}
	return suggestions, nil
}

type subscriptionResolver struct{ *Resolver }

func (r *subscriptionResolver) ItemChanged(ctx context.Context, input SubscritionInput) (<-chan *Item, error) {
	panic("not implemented")
}
func (r *subscriptionResolver) SectionChanged(ctx context.Context, input SubscritionInput) (<-chan *Section, error) {
	panic("not implemented")
}
