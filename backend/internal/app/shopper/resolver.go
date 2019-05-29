package app

import (
	"context"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct{}

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

func (r *mutationResolver) CreateTable(ctx context.Context, input *NewTableMap) (*TableMap, error) {
	panic("not implemented")
}
func (r *mutationResolver) DeleteTabel(ctx context.Context, id string) (*TableMap, error) {
	panic("not implemented")
}
func (r *mutationResolver) CreateItem(ctx context.Context, input *NewItem) (*Item, error) {
	panic("not implemented")
}
func (r *mutationResolver) UpdateItem(ctx context.Context, input NewItem) (*Item, error) {
	panic("not implemented")
}
func (r *mutationResolver) DeleteItem(ctx context.Context, id string) (*Item, error) {
	panic("not implemented")
}
func (r *mutationResolver) CreateSection(ctx context.Context, input *NewSection) (*Section, error) {
	panic("not implemented")
}
func (r *mutationResolver) UpdateSection(ctx context.Context, input *NewSection) (*Section, error) {
	panic("not implemented")
}
func (r *mutationResolver) DeleteSection(ctx context.Context, id string) (*Section, error) {
	panic("not implemented")
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Table(ctx context.Context, id string) (*Table, error) {
	panic("not implemented")
}
func (r *queryResolver) Tables(ctx context.Context) ([]*TableMap, error) {
	panic("not implemented")
}
func (r *queryResolver) Suggestions(ctx context.Context) ([]*Suggestion, error) {
	panic("not implemented")
}

type subscriptionResolver struct{ *Resolver }

func (r *subscriptionResolver) ItemChanged(ctx context.Context, input SubscritionInput) (<-chan *Item, error) {
	panic("not implemented")
}
func (r *subscriptionResolver) SectionChanged(ctx context.Context, input SubscritionInput) (<-chan *Section, error) {
	panic("not implemented")
}
